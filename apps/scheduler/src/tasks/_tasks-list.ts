import type { z } from "zod";

import type { TestTaskSchema } from "./test.task";
import { testTask } from "./test.task";

declare global {
  namespace GraphileWorker {
    interface Tasks extends TaskNameToPayloadMap {}
  }
}

// TODO: fix inference
type TaskNameToPayloadMap = {
  "test-task": z.infer<typeof TestTaskSchema>;
};

export const tasks = [
  testTask,
] as const;

type TasksList<T extends typeof tasks = typeof tasks> = Record<
  T[number]["name"],
  T[number]["task"]
>;

export const taskList = tasks.reduce<TasksList>(
  (acc, task) => Object.assign(acc, { [task.name]: task.task }),
  {} as TasksList,
);
