import { createTool } from "@convex-dev/agent";
import z from "zod";
import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";

export const resolveConversation = createTool({
  description: "Selesaikan percakapan",
  args: z.object({}),
  handler: async (ctx) => {
    if (!ctx.threadId) {
      return "ID thread hilang";
    }

    await ctx.runMutation(internal.system.conversations.resolve, {
      threadId: ctx.threadId,
    });

    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: "Percakapan selesai.",
      },
    });

    return "Percakapan selesai.";
  },
});
