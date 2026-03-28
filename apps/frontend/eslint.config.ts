import tanstackQueryPlugin from "@tanstack/eslint-plugin-query";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { globalIgnores } from "eslint/config";
import globals from "globals";

import { base } from "../../tooling/eslint/base-config";

export default base({
  tsconfigRootDir: import.meta.dirname,
  fileExtensions: {
    js: ["jsx"],
    ts: ["tsx"],
  },
  configs: [
    globalIgnores(["dist"]),
    {
      extends: [
        reactPlugin.configs.flat["recommended"] ?? {},
        reactPlugin.configs.flat["jsx-runtime"] ?? {},
        reactHooks.configs.flat["recommended-latest"],
        reactRefresh.configs.vite,
        tanstackQueryPlugin.configs["flat/recommended"],
      ],
      languageOptions: { globals: globals.browser },
      rules: {
        "react/boolean-prop-naming": "error",
        "react/button-has-type": "error",
        "react/jsx-boolean-value": "error",
        "react/jsx-fragments": "error",
        "react/jsx-no-useless-fragment": "error",
      },
      settings: {
        react: {
          version: "detect",
        },
      },
    },
  ],
});
