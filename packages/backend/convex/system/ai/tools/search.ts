import { google } from "@ai-sdk/google";
import { createTool } from "@convex-dev/agent";
import { generateText } from "ai";
import z from "zod";
import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";
import rag from "../rag";
import { SEARCH_INTERPRETER_PROMPT } from "../constants";

export const search = createTool({
  description:
    "Cari di basis pengetahuan untuk mendapatkan informasi yang relevan guna membantu menjawab pertanyaan pengguna.",
  args: z.object({
    query: z.string().describe("Query pencarian untuk menemukan informasi yang relevan."),
  }),
  handler: async (ctx, args) => {
    if (!ctx.threadId) {
      return "ID Thread hilang";
    }

    const conversation = await ctx.runQuery(internal.system.conversations.getByThreadId, {
      threadId: ctx.threadId,
    });

    if (!conversation) {
      return "Percakapan tidak ditemukan.";
    }

    const orgId = conversation.organizationId;

    const searchResult = await rag.search(ctx, {
      namespace: orgId,
      query: args.query,
      limit: 5,
    });

    const contextText = `Ditemukan hasil dalam ${searchResult.entries
      .map((e) => e.title || null)
      .filter((t) => t !== null)
      .join(", ")}. Berikut adalah konteksnya:\n\n${searchResult.text}`;

    const response = await generateText({
      messages: [
        {
          role: "system",
          content: SEARCH_INTERPRETER_PROMPT,
        },
        {
          role: "user",
          content: `Pengguna bertanya: "${args.query}"\n\nHasil pencarian: ${contextText}`,
        },
      ],
      model: google("gemini-2.5-flash"),
    });

    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: response.text,
      },
    });

    return response.text;
  },
});
