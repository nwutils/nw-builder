import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import jsdoc from "eslint-plugin-jsdoc";
import nodeSecurity from "eslint-plugin-node-security";
import secureCoding from "eslint-plugin-secure-coding";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      jsdoc,
      "node-security": nodeSecurity,
      "secure-coding": secureCoding,
      "simple-import-sort": simpleImportSort,
    },
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      ...js.configs.recommended.rules,
      semi: ["error", "always"],
      quotes: ["error", "double", { avoidEscape: true }],
      "jsx-quotes": ["error", "prefer-double"],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      /*
       * Security rules are enabled individually rather than via the plugins'
       * `recommended` sets. This package does three things - fetch a URL,
       * write it to disk, unpack it - so most of the recommended rules (SQL,
       * GraphQL, LDAP, auth, session) cover surface that does not exist here.
       * Enabling only what applies keeps every finding actionable; add a rule
       * when the matching surface appears.
       */

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
]);
