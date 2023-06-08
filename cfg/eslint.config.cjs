module.exports = {
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  env: {
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "tjw-jsdoc"],
  rules: {
    "jsdoc/require-file-overview": "off",
    "jsdoc/require-returns-description": "off",
    "jsdoc/match-description": "off",
    "jsdoc/valid-types": "off",
  },
};
