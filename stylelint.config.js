// @ts-check

/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard", "stylelint-config-clean-order/error"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["theme", "custom-variant"],
      },
    ],
    "import-notation": "string",
  },
};
