import { z } from "zod";

import { createTask } from "@/utils";

export const TestTaskSchema = z.object({
  name: z.string(),
});

export const testTask = createTask({
  name: "test-task",
  schema: TestTaskSchema,
  task: async ({ name }) => {
    console.log(`Hello, ${name}!`);
  },
});
