import { z } from "zod";

import type { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../trpc";

export const postRouter = {
  all: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input: { limit = 20, cursor } }) => {
      const trades = await ctx.db.trade.findMany({
        take: limit + 1,
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        orderBy: {
          deal: {
            date: "desc",
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (trades.length > limit) {
        const nextItem = trades.pop();
        nextCursor = nextItem!.id;
      }

      return {
        trades,
        nextCursor,
      };
    }),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.trade.findFirst({
        where: {
          id: input.id,
        },
      });
    }),
} satisfies TRPCRouterRecord;
