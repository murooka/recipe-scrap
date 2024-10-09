// @ts-check

import { FlatCompat } from "@eslint/eslintrc";
// @ts-ignore
import js from "@eslint/js";
import ts from "typescript-eslint";
// @ts-ignore
import jsxA11y from "eslint-plugin-jsx-a11y";
import * as importPlugin from "eslint-plugin-import";

const compat = new FlatCompat();

export default ts.config(
  {
    ignores: [".next", ".vscode", "coverage", "node_modules"],
  },
  js.configs.recommended,

  // typescript-eslint
  ...ts.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ["**/*.ts?(x)"],
  })),
  {
    files: ["**/*.ts?(x)"],
    languageOptions: {
      parserOptions: {
        project: true,
        // @ts-ignore
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.ts?(x)"],
    rules: {
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/restrict-template-expressions": "off",
    },
  },

  // @next/eslint-plugin-next
  ...compat.extends("next/core-web-vitals"),

  // eslint-plugin-jsx-a11y
  {
    files: ["**/*.ts?(x)"],
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },

  // eslint-plugin-import
  {
    files: ["**/*.ts?(x)"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      ...importPlugin.configs["recommended"].rules,
      "import/no-useless-path-segments": "warn",
      "import/consistent-type-specifier-style": ["warn", "prefer-top-level"],
      "import/order": [
        "warn",
        {
          pathGroups: [
            { pattern: "@lib/**", group: "internal" },
            { pattern: "@server/**", group: "internal" },
          ],
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
    settings: {
      // https://github.com/import-js/eslint-plugin-import/issues/2556#issuecomment-1419518561
      "import/parsers": {
        espree: [".js", ".cjs", ".mjs", ".jsx"],
      },
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
  },
);
