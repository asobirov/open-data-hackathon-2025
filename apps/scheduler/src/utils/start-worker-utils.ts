import type { WorkerUtils, WorkerUtilsOptions } from "graphile-worker";
import { makeWorkerUtils } from "graphile-worker";

import { env } from "@duck/db/env";

export let workerUtils: WorkerUtils | null = null;

export const startWorkerUtils = async (
  opts: WorkerUtilsOptions = {},
): Promise<WorkerUtils> => {
  console.info("Starting worker utils");

  if (workerUtils) {
    console.warn("Worker utils already started");
    return workerUtils;
  }

  workerUtils = await makeWorkerUtils({
    connectionString: env.DATABASE_URL,
    ...opts,
  });

  console.info("Worker utils started");
  return workerUtils;
};
