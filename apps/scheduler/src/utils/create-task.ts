import type { JobHelpers, Task } from "graphile-worker";
import type { z } from "zod";

import { addJob } from "@/utils";

export type TypedTask<Payload, Return> = (
  payload: Payload,
  helpers: Omit<JobHelpers, "addJob"> & {
    addJob: typeof addJob;
  },
) => Promise<Return>;

type CreateTaskArgs<N extends string, T> = {
  /**
   * Task name
   */
  name: N;
  /**
   * Payload schema
   */
  schema: z.ZodType<T>;
  task: TypedTask<T, void>;
};

export type CreateTaskReturn<N extends string, T> = {
  task: TypedTask<T, void>;
  name: N;
  schema: z.ZodType<T>;
};

export const createTask = <N extends string, T>({
  name,
  schema,
  task,
}: CreateTaskArgs<N, T>): CreateTaskReturn<N, T> => {
  const _wrappingTask: Task = async (payload, helpers) => {
    const validatedPayload = schema.parse(payload);

    return await task(validatedPayload, {
      ...helpers,
      addJob,
    });
  };

  return {
    task: _wrappingTask as TypedTask<T, void>,
    name,
    schema,
  };
};
