// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "plugin:rxjs/recommended"
    ],
    parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2019,
        sourceType: "script"
    },
    plugins: ["@typescript-eslint", "prettier", "rxjs"],
    rules: {
        "prettier/prettier": [
            "error",
            {
                endOfLine: "auto"
            }
        ],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/no-empty-interface": [
            "error",
            {
                allowSingleExtends: true
            }
        ],
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_" // https://github.com/typescript-eslint/typescript-eslint/issues/1054
            }
        ],
        "@typescript-eslint/no-explicit-any": ["error"],
        "@typescript-eslint/no-use-before-define": ["error", { functions: false, classes: true }],
        "@typescript-eslint/no-shadow": ["warn"],
        "rxjs/ban-observables": "error",
        "rxjs/no-unsafe-catch": "error",
        "rxjs/no-unsafe-first": "error",
        "rxjs/prefer-observer": "error",
        "rxjs/no-subclass": "error"
    }
};
