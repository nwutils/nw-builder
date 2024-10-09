import js from "@eslint/js";
import jsdoc from 'eslint-plugin-jsdoc';
import globals from "globals";

export default [
  {
    languageOptions:
    {
      globals: globals.node
    }
  },
  js.configs.recommended,
  jsdoc.configs['flat/recommended'],
  {
    rules: {
      "no-control-regex": ["off"],
      "semi": ["error", "always"],
      "quotes": ["error", "single"],
    }
  }

];
