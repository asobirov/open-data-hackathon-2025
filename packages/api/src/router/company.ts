import { z } from "zod";

import type { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../trpc";

export const companyRouter = {
  all: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
        direction: z.enum(["forward", "backward"]), // optional, useful for bi-directional query
      }),
    )
    .query(async (opts) => {
      const { input, ctx } = opts;
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const items = await ctx.db.company.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
      });

      console.log(items);

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }
      return {
        items,
        nextCursor,
      };
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.post.findFirst({
        where: {
          id: input.id,
        },
      });
    }),
} satisfies TRPCRouterRecord;
