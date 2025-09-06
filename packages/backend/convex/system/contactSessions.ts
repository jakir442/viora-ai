import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";
import { SESSION_DURATION_MS } from "../constants";

const AUTO_REFRESH_THRESHOLD_MS = 4 * 60 * 60 * 1000;

export const refresh = internalMutation({
  args: {
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);

    if (!contactSession) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Sesi Kontak tidak ditemukan",
      });
    }

    if (contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Sesi Kontak expired",
      });
    }

    const timeRemaining = contactSession.expiresAt - Date.now();

    if (timeRemaining < AUTO_REFRESH_THRESHOLD_MS) {
      const newExpiresAt = Date.now() + SESSION_DURATION_MS;

      await ctx.db.patch(args.contactSessionId, {
        expiresAt: newExpiresAt,
      });

      return { ...contactSession, expiresAt: newExpiresAt };
    }
    return contactSession;
  },
});

export const getOne = internalQuery({
  args: {
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.contactSessionId);
  },
});
