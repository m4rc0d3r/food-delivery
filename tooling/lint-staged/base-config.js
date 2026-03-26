// @ts-check

import { isAsyncFunction } from "node:util/types";

const COMMANDS = {
  prettier: "prettier --write",
  stylelint: "stylelint --fix",
  eslint: "eslint --flag v10_config_lookup_from_file --fix",
  typescript: "tsc -b --noEmit",
  syncpack: "syncpack format",
};

const SPACE = " ";

/**
 * @param {string} command
 * @param {readonly string[]} args
 */
function runCommand(command, args) {
  return [command, ...args].join(SPACE);
}

/**
 * @template {unknown[]} [Args=any[]] Default is `any[]`
 * @template [Result=any] Default is `any`
 * @typedef {(...args: Args) => Result} Fn
 */

/**
 * @typedef {import("lint-staged").Configuration} LintStagedConfig
 *
 * @typedef {Extract<LintStagedConfig, Record<string, unknown>>} LintStagedConfigAsRecord
 *
 * @typedef {Exclude<
 *   LintStagedConfigAsRecord[keyof LintStagedConfigAsRecord],
 *   Record<string, unknown>
 * >} LintStagedConfigAsRecordEntryValue
 *
 *
 * @typedef {Parameters<Extract<LintStagedConfigAsRecordEntryValue, Fn>>[0]} StagedFileNames
 */

/**
 * @typedef {Object} Config
 * @property {LintStagedConfigAsRecordEntryValue | undefined} [jsTs]
 */

/**
 * @param {LintStagedConfigAsRecordEntryValue} value
 * @param {StagedFileNames} stagedFileNames
 */
async function handleConfigEntryValue(value, stagedFileNames) {
  return Promise.all(
    (Array.isArray(value) ? value : [value]).map(async (value) => {
      /** @typedef {Fn<any[], Promise<any>>} AsyncFn */

      if (typeof value === "function")
        return isAsyncFunction(value)
          ? await /** @type {Extract<LintStagedConfigAsRecordEntryValue, AsyncFn>} */ value(
              stagedFileNames,
            )
          : /** @type {Exclude<Extract<LintStagedConfigAsRecordEntryValue, Fn>, AsyncFn>} */ (
              value
            )(stagedFileNames);

      return value;
    }),
  ).then((values) => values.flat());
}

/**
 * @param {Config} config
 * @returns {LintStagedConfig}
 */
function base({ jsTs } = {}) {
  return {
    "package.json": (files) => [
      runCommand(
        COMMANDS.syncpack,
        files.map((value) => `-s '${value}'`),
      ),
      runCommand(COMMANDS.prettier, files),
    ],
    "!(package).json": COMMANDS.prettier,
    "*.{yaml,yml,html,md}": COMMANDS.prettier,
    "*.css": [COMMANDS.stylelint, COMMANDS.prettier],
    "*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}": async (files) => [
      runCommand(COMMANDS.eslint, files),
      runCommand(COMMANDS.prettier, files),
      COMMANDS.typescript,
      ...(jsTs ? await handleConfigEntryValue(jsTs, files) : []),
    ],
  };
}

export { base };
