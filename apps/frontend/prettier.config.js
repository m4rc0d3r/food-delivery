// @ts-check

import * as prettierPluginTailwindcss from "prettier-plugin-tailwindcss";

import { base } from "../../tooling/prettier/base-config.js";

/** @type {import("prettier").Config & import("prettier-plugin-tailwindcss").PluginOptions} */
export default {
  ...base,
  plugins: [...(base.plugins ?? []), prettierPluginTailwindcss],
};
