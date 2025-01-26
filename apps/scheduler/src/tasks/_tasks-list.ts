import type { z } from "zod";

import type { TestTaskSchema } from "./test.task";
import type { GenerateReportSchema } from "@/tasks/gen-report";
import { generateReportTask } from "@/tasks/gen-report";
import { startReportGeneration } from "@/tasks/start-report-generation";
import { testTask } from "./test.task";

declare global {
  namespace GraphileWorker {
    interface Tasks extends TaskNameToPayloadMap {}
  }
}

// TODO: fix inference
type TaskNameToPayloadMap = {
  "test-task": z.infer<typeof TestTaskSchema>;
  "generate-report-task": z.infer<typeof GenerateReportSchema>;
}

export const tasks = [
  testTask,
  generateReportTask,
  startReportGeneration,
] as const;

type TasksList<T extends typeof tasks = typeof tasks> = Record<
  T[number]["name"],
  T[number]["task"]
>;

export const taskList = tasks.reduce<TasksList>(
  (acc, task) => Object.assign(acc, { [task.name]: task.task }),
  {} as TasksList,
);
