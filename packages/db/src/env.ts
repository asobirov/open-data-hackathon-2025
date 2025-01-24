import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export * from "./client";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),

    DATABASE_URL: z.string().url(),
  },

  runtimeEnv: process.env,
});
