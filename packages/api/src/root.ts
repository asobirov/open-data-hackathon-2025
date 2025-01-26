import { authRouter } from "./router/auth";
import { companyRouter } from "./router/company";
import { dealRouter } from "./router/deal";
import { postRouter } from "./router/post";
import { tradeRouter } from "./router/trade";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  company: companyRouter,
  trade: tradeRouter,
  deal: dealRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
