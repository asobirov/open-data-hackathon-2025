import baseConfig from "@duck/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".nitro/**", ".output/**"],
  },
  ...baseConfig,
];
