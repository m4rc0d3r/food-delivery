import { iife, NON_EXISTENT_INDEX } from "@workspace/core";
import type { Context } from "react";
import { createContext, useContext } from "react";

function createContextWithDisplayName<T>(
  defaultValue: Parameters<typeof createContext<T>>[0],
  name: string,
) {
  const context = createContext(defaultValue);
  context.displayName = name;

  return context;
}

function createUseNullableContext<T>(context: Context<T | null>, hookName?: string) {
  const hookName_ = iife(() => {
    if (typeof hookName === "string") return hookName;

    const contextName = context.displayName ?? context.name;
    const index = contextName.indexOf("Context");

    return index === NON_EXISTENT_INDEX
      ? `useContext(${contextName})`
      : `use${contextName.slice(0, index)}()`;
  });

  return () => {
    const value = useContext(context);

    if (value === null)
      throw new TypeError(
        `The '${hookName_}' hook should only be used within '${context.displayName}.Provider'`,
      );

    return value;
  };
}

export { createContextWithDisplayName, createUseNullableContext };
