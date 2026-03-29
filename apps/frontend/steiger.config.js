import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    files: ["./src/shared/**"],
    rules: {
      "fsd/public-api": "off",
    },
  },
  {
    files: ["src/shared/ui/lib/**"],
    rules: {
      "fsd/no-reserved-folder-names": "off",
    },
  },
  {
    files: ["src/{entities/{auth,category,di,event-bus,store,store-product,user},widgets}/**"],
    rules: {
      "fsd/insignificant-slice": "off",
    },
  },
]);
