import type { Job, TaskSpec } from "graphile-worker";

import type { tasks } from "../tasks/_tasks-list"; // ! Must be imported for correct type inference
import { workerUtils } from "./start-worker-utils";

type AddJobOptions<N extends keyof GraphileWorker.Tasks> = {
  name: N;
  payload: N extends keyof GraphileWorker.Tasks
    ? GraphileWorker.Tasks[N]
    : never;
  options?: TaskSpec;
};

export const addJob = <N extends keyof GraphileWorker.Tasks>({
  name,
  payload,
  options,
}: AddJobOptions<N>): Promise<Job> => {
  if (!workerUtils) {
    throw new Error(
      "Attempted to add a job before the workerUtils was initialized",
    );
  }

  return workerUtils.addJob(name, payload, options);
};
