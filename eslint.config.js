import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import jsdoc from "eslint-plugin-jsdoc";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

const nodeSources = [
  "packages/doctor/**/*.{js,mjs,cjs}",
  "packages/getter/**/*.{js,mjs,cjs}",
  "packages/runner/**/*.{js,mjs,cjs}",
  "packages/nw-builder/**/*.{js,mjs,cjs}",
  "packages/builder/**/*.{js,mjs,cjs}",
  "packages/packager/**/*.{js,mjs,cjs}",
  "tests/specs/doctor/**/*.{js,mjs,cjs}",
  "tests/specs/getter/**/*.{js,mjs,cjs}",
  "tests/specs/runner/**/*.{js,mjs,cjs}",
  "tests/specs/nw-builder/**/*.{js,mjs,cjs}",
  "tests/specs/builder/**/*.{js,mjs,cjs}",
  "tests/specs/packager/**/*.{js,mjs,cjs}",
  "tests/fixtures/getter/**/*.{js,mjs,cjs}",
  "tests/fixtures/nw-builder/**/*.{js,mjs,cjs}",
  "tests/fixtures/runner/**/*.{js,mjs,cjs}",
  "tests/fixtures/builder/**/*.{js,mjs,cjs}",
  "tests/fixtures/packager/**/*.{js,mjs,cjs}",
];

export default defineConfig([
  {
    ignores: ["packages/doctor/.doctor-cache/**"],
  },

  /* Shared baseline: every package gets ESLint's recommended rules and Node globals. */
  {
    files: nodeSources,
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },

  /*
   * doctor and getter both additionally enforce semi/quotes/jsx-quotes and
   * import ordering. nw-builder and runner never turned these on, so they
   * stay out of this block rather than getting a stricter baseline than
   * they had before.
   */
  {
    files: [
      "packages/doctor/**/*.{js,mjs,cjs}",
      "packages/getter/**/*.{js,mjs,cjs}",
      "tests/specs/doctor/**/*.{js,mjs,cjs}",
      "tests/specs/getter/**/*.{js,mjs,cjs}",
      "tests/fixtures/getter/**/*.{js,mjs,cjs}",
    ],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double", { avoidEscape: true }],
      "jsx-quotes": ["error", "prefer-double"],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },

  /* nw-builder: semi/quotes plus the jsdoc plugin's recommended rule set. */
  {
    files: ["packages/nw-builder/**/*.{js,mjs,cjs}"],
    extends: [jsdoc.configs["flat/recommended"]],
    rules: {
      "no-control-regex": "off",
      semi: ["error", "always"],
      quotes: ["error", "double", { avoidEscape: true }],
    },
  },

  /*
   * cli: runs in a browser-like NW.js window as well as Node, so it gets
   * browser/chrome/nw globals instead of Node-only ones. It never carried
   * any of the rules above.
   */
  {
    files: [
      "packages/cli/**/*.{js,mjs,cjs}",
      "tests/specs/cli/**/*.{js,mjs,cjs}",
    ],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        chrome: "readonly",
        nw: "readonly",
      },
    },
  },
]);
