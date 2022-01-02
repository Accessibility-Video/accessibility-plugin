const { join } = require("path");
module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2019,
    project: join(__dirname, "./tsconfig.json"),
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "rxjs",
  ],
  extends: ["plugin:rxjs/recommended"],
  rules: {
    "rxjs/ban-observables": "error",
    "rxjs/no-unsafe-catch": "error",
    "rxjs/no-unsafe-first": "error",
    "rxjs/prefer-observer": "error",
    "rxjs/no-subclass": "error",
  },
};
