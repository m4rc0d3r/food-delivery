import { globalIgnores } from "eslint/config";

import { base } from "../../tooling/eslint/base-config";

export default base({
  tsconfigRootDir: import.meta.dirname,
  configs: [globalIgnores([".wrangler", "dist"])],
});
