import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import { env as dbEnv } from "@duck/db/env";

export const env = createEnv({
  extends: [dbEnv],
  server: {
    // GOOGLE_GENERATIVE_AI_API_KEY: z.string(),

    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),


    OPENAI_API_KEY: z.string().optional(),
  },

  emptyStringAsUndefined: false,
  runtimeEnv: process.env,
});
