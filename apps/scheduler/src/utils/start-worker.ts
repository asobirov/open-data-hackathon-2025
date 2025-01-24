import { env } from "@duck/db/env";
import type { Runner } from "graphile-worker";
import { run } from "graphile-worker";

export let runner: Runner | null = null;

export const startWorker: typeof run = async (options) => {
  if (runner) {
    return runner;
  }

  runner = await run({
    connectionString: env.DATABASE_URL,
    ...options,
  });

  return runner;
};
