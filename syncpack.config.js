// @ts-check

/** @type {import("syncpack").RcFile} */
export default {
  versionGroups: [
    {
      label: "Use workspace protocol for local packages",
      dependencies: ["$LOCAL"],
      dependencyTypes: ["dev", "peer", "prod"],
      pinVersion: "workspace:*",
    },
  ],
};
