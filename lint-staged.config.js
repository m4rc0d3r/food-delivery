// @ts-check

import micromatch from "micromatch";

const COMMANDS = {
  prettier: "prettier --write",
  stylelint: "stylelint --fix",
  eslint: "eslint --flag v10_config_lookup_from_file --fix",
  typescript: "tsc --noEmit",
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

/** @type {import("lint-staged").Configuration} */
export default {
  "*.{json,yaml,yml,html,md}": (files) => {
    const packageJsons = micromatch(files, "**/package.json");
    if (packageJsons.length === 0) return runCommand(COMMANDS.prettier, files);

    const nonPackageJsons = files.filter((value) => !packageJsons.includes(value));

    return [
      ...(nonPackageJsons.length > 0 ? [runCommand(COMMANDS.prettier, nonPackageJsons)] : []),
      runCommand(
        COMMANDS.syncpack,
        packageJsons.map((value) => `-s '${value}'`),
      ),
      runCommand(COMMANDS.prettier, packageJsons),
    ];
  },
  "*.css": [COMMANDS.stylelint, COMMANDS.prettier],
  "*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}": (files) => [
    runCommand(COMMANDS.eslint, files),
    runCommand(COMMANDS.prettier, files),
    COMMANDS.typescript,
  ],
};
