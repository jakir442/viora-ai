import { createTool } from "@convex-dev/agent";
import z from "zod";
import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";

export const escalateConversation = createTool({
  description: "Tingkatkan percakapan",
  args: z.object({}),
  handler: async (ctx) => {
    if (!ctx.threadId) {
      return "ID thread hilang";
    }

    await ctx.runMutation(internal.system.conversations.escalate, {
      threadId: ctx.threadId,
    });

    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: "Percakapan dialihkan ke operator manusia.",
      },
    });

    return "Percakapan dialihkan ke operator manusia.";
  },
});
