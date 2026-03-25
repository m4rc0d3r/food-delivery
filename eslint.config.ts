import js from "@eslint/js";
import configPrettier from "eslint-config-prettier/flat";
import pluginImport from "eslint-plugin-import";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

const FILE_EXTENSIONS = {
  js: ["js", "mjs", "cjs"],
  ts: ["ts", "mts", "cts"],
};
const TSCONFIG_ROOT_DIR = import.meta.dirname;

export default defineConfig([
  {
    files: [`**/*.{${Object.values(FILE_EXTENSIONS).flat().join()}}`],
    plugins: {
      js,
    },
    extends: ["js/recommended"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: TSCONFIG_ROOT_DIR,
      },
    },
  },
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    rules: {
      eqeqeq: "error",

      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          accessibility: "no-public",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/prefer-nullish-coalescing": [
        "error",
        {
          ignorePrimitives: true,
        },
      ],
    },
  },
  {
    files: [`**/*.{${FILE_EXTENSIONS.js.join()}}`],
    ...tseslint.configs.disableTypeChecked,
  },
  pluginImport.flatConfigs.recommended,
  {
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: TSCONFIG_ROOT_DIR,
        },
        node: {
          extensions: Object.values(FILE_EXTENSIONS)
            .flat()
            .map((value) => `.${value}`),
        },
      },
    },
    rules: {
      "import/no-empty-named-blocks": "error",
      "import/no-absolute-path": "error",
      "import/no-self-import": "error",
      "import/no-useless-path-segments": [
        "error",
        {
          noUselessIndex: true,
        },
      ],
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import/exports-last": "error",
      "import/first": "error",
      "import/group-exports": "error",
      "import/newline-after-import": "error",
      "import/no-named-default": "error",
      "import/order": [
        "error",
        {
          "newlines-between": "always",
        },
      ],
    },
  },
  configPrettier,
]);
