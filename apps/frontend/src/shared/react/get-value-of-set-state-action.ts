import type { Fn } from "@workspace/core";
import type { SetStateAction } from "react";

function getValueOfSetStateAction<T>(action: SetStateAction<T>, prevState: T) {
  return typeof action === "function" ? (action as Fn<[T], T>)(prevState) : action;
}

export { getValueOfSetStateAction };
