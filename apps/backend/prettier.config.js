// @ts-check

import * as prettierPluginEmbed from "prettier-plugin-embed";
import prettierPluginSql from "prettier-plugin-sql";

import { base } from "../../tooling/prettier/base-config.js";

/** @type {import("prettier").Config } */
export default {
  ...base,
  plugins: [...(base.plugins ?? []), prettierPluginEmbed, prettierPluginSql],
  language: "postgresql",
  keywordCase: "upper",
  dataTypeCase: "upper",
  functionCase: "lower",
  identifierCase: "lower",
};
