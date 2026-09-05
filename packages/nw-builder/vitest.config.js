import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["../../tests/specs/nw-builder/*.test.js"],
    coverage: {
      provider: "v8",
      all: true,
      include: ["src/**/*.js"],
      reporter: ["json", "json-summary"],
    },
  },
});
