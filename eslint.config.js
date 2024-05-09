import stylisticJs from '@stylistic/eslint-plugin-js';
import eslint from 'eslint';
import eslintConfigTjwJsdoc from 'eslint-config-tjw-jsdoc';
import tjw from 'eslint-config-tjw-jsdoc';
import md from 'eslint-plugin-markdown';

export default [
  ...eslintConfigTjwJsdoc.rules,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
      },
    },
    plugins: {
      '@stylistic/js': stylisticJs,
      'jsdoc': tjw,
      eslint,
      tjw,
      md,
    },
    rules: {
      "@stylistic/js/indent": [
        "error",
        2
      ],
      "jsdoc/require-file-overview": "off"
    }
  }
];
