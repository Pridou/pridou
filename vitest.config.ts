import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    passWithNoTests: true,
    coverage: {
      include: ["src"],
      reporter: process.env.CI === "true" ? ["lcovonly"] : ["text", "html"],
    },
  },
});
