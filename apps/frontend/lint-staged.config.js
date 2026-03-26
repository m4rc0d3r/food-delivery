// @ts-check

import { base } from "../../tooling/lint-staged/base-config.js";

export default base({
  jsTs: ["steiger", "--fail-on-warnings", "src"].join(" "),
});
