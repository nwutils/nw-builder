import js from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";
import globals from "globals";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
  {
    languageOptions: {
      globals: globals.node,
    },
    plugins: {
      "simple-import-sort": simpleImportSort, // <-- add this
    },
  },
  js.configs.recommended,
  jsdoc.configs["flat/recommended"],
  {
    rules: {
      "no-control-regex": ["off"],
      semi: ["error", "always"],
      quotes: ["error", "double", { avoidEscape: true }],
    },
  },
];
