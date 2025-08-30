import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import type { StorageActionWriter } from "convex/server";
import { assert } from "convex-helpers";
import { Id } from "../_generated/dataModel";

const AI_MODELS = {
  image: google("gemini-2.5-flash"),
  pdf: google("gemini-2.0-flash"),
  html: google("gemini-2.0-flash"),
} as const;

const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

const SYSTEM_PROMPTS = {
  image:
    "Anda mengubah gambar menjadi teks. Jika itu adalah foto dokumen, transkripsikan. Jika bukan dokumen, jelaskan isinya.",
  pdf: "Anda mengubah file PDF menjadi teks.",
  html: "Anda mengubah konten menjadi markdown.",
};

export type ExtractTextContentArgs = {
  storageId: Id<"_storage">;
  filename: string;
  bytes?: ArrayBuffer;
  mimeType: string;
};

export async function extractTextContent(
  ctx: { storage: StorageActionWriter },
  args: ExtractTextContentArgs
): Promise<string> {
  const { storageId, filename, bytes, mimeType } = args;

  const url = await ctx.storage.getUrl(storageId);
  assert(url, "Gagal mendapatkan URL penyimpanan");

  if (SUPPORTED_IMAGE_TYPES.some((type) => type === mimeType)) {
    return extractImageText(url);
  }

  if (mimeType.toLowerCase().includes("pdf")) {
    return extractPdfText(url, mimeType, filename);
  }

  if (mimeType.toLowerCase().includes("text")) {
    return extractTextFileContent(ctx, storageId, bytes, mimeType);
  }

  throw new Error(`Tipe MIME tidak didukung: ${mimeType}`);
}

async function extractTextFileContent(
  ctx: { storage: StorageActionWriter },
  storageId: Id<"_storage">,
  bytes: ArrayBuffer | undefined,
  mimeType: string
): Promise<string> {
  const arrayBuffer = bytes || (await (await ctx.storage.get(storageId))?.arrayBuffer());

  if (!arrayBuffer) {
    throw new Error("Gagal mendapatkan konten file");
  }

  const text = new TextDecoder().decode(arrayBuffer);

  if (mimeType.toLowerCase() !== "text/plain") {
    const result = await generateText({
      model: AI_MODELS.html,
      system: SYSTEM_PROMPTS.html,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text },
            {
              type: "text",
              text: "Ekstrak teks dan cetak dalam format markdown, tanpa menjelaskan bahwa Anda akan melakukannya.",
            },
          ],
        },
      ],
    });

    return result.text;
  }

  return text;
}

async function extractPdfText(url: string, mimeType: string, filename: string): Promise<string> {
  const result = await generateText({
    model: AI_MODELS.pdf,
    system: SYSTEM_PROMPTS.pdf,
    messages: [
      {
        role: "user",
        content: [
          { type: "file", data: new URL(url), mediaType: mimeType, filename },
          {
            type: "text",
            text: "Ekstrak teks dari PDF dan cetak, tanpa menjelaskan bahwa Anda akan melakukannya.",
          },
        ],
      },
    ],
  });
  return result.text;
}

async function extractImageText(url: string): Promise<string> {
  const result = await generateText({
    model: AI_MODELS.image,
    system: SYSTEM_PROMPTS.image,
    messages: [
      {
        role: "user",
        content: [{ type: "image", image: new URL(url) }],
      },
    ],
  });

  return result.text;
}
