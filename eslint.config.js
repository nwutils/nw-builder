import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import jsdoc from "eslint-plugin-jsdoc";
import nodeSecurity from "eslint-plugin-node-security";
import secureCoding from "eslint-plugin-secure-coding";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

const nodeSources = [
  "packages/doctor/**/*.{js,mjs,cjs}",
  "packages/getter/**/*.{js,mjs,cjs}",
  "packages/runner/**/*.{js,mjs,cjs}",
  "packages/nw-builder/**/*.{js,mjs,cjs}",
  "packages/test-coverage/**/*.{js,mjs,cjs}",
  "tests/specs/doctor/**/*.{js,mjs,cjs}",
  "tests/specs/getter/**/*.{js,mjs,cjs}",
  "tests/specs/runner/**/*.{js,mjs,cjs}",
  "tests/specs/nw-builder/**/*.{js,mjs,cjs}",
  "tests/specs/test-coverage/**/*.{js,mjs,cjs}",
  "tests/fixtures/getter/**/*.{js,mjs,cjs}",
  "tests/fixtures/nw-builder/**/*.{js,mjs,cjs}",
  "tests/fixtures/runner/**/*.{js,mjs,cjs}",
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
   * getter: security rules for the one package that fetches URLs, writes
   * them to disk and unpacks them. Most of each plugin's `recommended` set
   * covers surface (SQL, GraphQL, LDAP, auth, session) that doesn't exist
   * here, so rules are enabled individually to keep every finding
   * actionable.
   */
  {
    files: ["packages/getter/**/*.{js,mjs,cjs}"],
    plugins: {
      "node-security": nodeSecurity,
      "secure-coding": secureCoding,
    },
    rules: {
      /* Archive extraction: the surface this package exists to handle. */
      "node-security/no-zip-slip": [
        "error",
        { pathValidationFunctions: ["resolveWithin"] },
      ],
      "node-security/no-arbitrary-file-access": "error",
      "node-security/no-toctou-vulnerability": "error",
      "node-security/detect-non-literal-fs-filename": "error",

      /* Remote fetch: URLs and redirect targets come from config. */
      "node-security/no-ssrf": "error",
      "node-security/no-insecure-http-parser": "error",
      "node-security/require-stream-error-handler": "error",

      /* Decompression of remote bytes. */
      "node-security/no-unbounded-decompression": "error",
      "secure-coding/no-unlimited-resource-allocation": "warn",

      /* Dynamic execution: none today, and none should appear. */
      "node-security/detect-child-process": "error",
      "node-security/detect-eval-with-expression": "error",
      "node-security/no-unsafe-dynamic-require": "error",
      "node-security/no-shell-injection": "error",

      /* Secrets and unsafe input shapes. */
      "secure-coding/no-hardcoded-credentials": "error",
      "secure-coding/no-unsafe-deserialization": "error",
      "secure-coding/no-redos-vulnerable-regex": "error",
      "secure-coding/no-bidi-characters": "error",
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
