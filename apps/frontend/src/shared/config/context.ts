import { createContext, useContext } from "react";

import type { Config } from "./config";

const ConfigContext = createContext<Config>({
  backendApp: {
    protocol: "http",
    address: "localhost",
    port: 8083,
  },
  nodeEnv: "dev",
});

function useConfigContext() {
  return useContext(ConfigContext);
}

export { ConfigContext, useConfigContext };
