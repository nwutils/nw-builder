import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      exclude: ["**/node_modules/**", "**/tests/**"],
      include: [
        'src',
      ],
      provider: 'v8',
      reporter: ['json', 'json-summary'],
      reportOnFailure: true,
    }
  }
});
