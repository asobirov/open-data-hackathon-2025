import { z } from "zod";

import type { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../trpc";

export const dealRouter = {
  all: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input: { limit = 20, cursor } }) => {
      const deals = await ctx.db.deal.findMany({
        take: limit + 1,
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        include: {
          category: true,
          customer: true,
          provider: true,
          trade: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (deals.length > limit) {
        const nextItem = deals.pop();
        nextCursor = nextItem!.id;
      }

      return {
        deals,
        nextCursor,
      };
    }),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.deal.findFirst({
        where: {
          id: input.id,
        },
        include: {
          category: true,
          customer: true,
          provider: true,
          trade: true,
        },
      });
    }),
} satisfies TRPCRouterRecord;
