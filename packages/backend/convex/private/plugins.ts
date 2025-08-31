import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const remove = mutation({
  args: {
    service: v.union(v.literal("vapi")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identitas tidak ditemukan",
      });
    }

    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organisai tidak ditemukan",
      });
    }

    const existingPlugin = await ctx.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) =>
        q.eq("organizationId", orgId).eq("service", args.service)
      )
      .unique();

    if (!existingPlugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "plugin tidak ditemukan",
      });
    }

    await ctx.db.delete(existingPlugin._id);
  },
});

export const getOne = query({
  args: {
    service: v.union(v.literal("vapi")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identitas tidak ditemukan",
      });
    }

    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organisai tidak ditemukan",
      });
    }

    return await ctx.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) =>
        q.eq("organizationId", orgId).eq("service", args.service)
      )
      .unique();
  },
});
