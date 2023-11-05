import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (context) => {
    return await context.db.query("groups").collect();
  },
});

export const getGroup = query({
  args: { id: v.id("groups") },
  handler: async (context, { id }) => {
    return await context.db
      .query("groups")
      .filter((q) => q.eq(q.field("_id"), id))
      .unique();
  },
});

export const create = mutation({
  args: { description: v.string(), name: v.string(), icon_url: v.string() },
  handler: async ({ db }, args) => {
    await db.insert("groups", args);
  },
});
