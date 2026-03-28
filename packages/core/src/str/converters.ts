import { EMPTY } from "./constants";

function capitalize<T extends string>(value: T) {
  return [value.charAt(0)?.toLocaleUpperCase(), value.slice(1)].join(EMPTY) as Capitalize<T>;
}

export { capitalize };
