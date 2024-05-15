
import stylistic from "@stylistic/eslint-plugin-js";
import jsdoc from "eslint-plugin-jsdoc";
import markdownPlugin from "eslint-plugin-markdown";

export default {
  languageOptions: {
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
  },
  plugins: {
    "@stylistic/js": stylistic.configs["all-flat"],
    "plugin:markdown/recommended": markdownPlugin.configs.recommended,
    "jsdoc": jsdoc.configs.recommended,
  },
  rules: {
    "jsdoc/require-file-overview": "off"
  }
}
