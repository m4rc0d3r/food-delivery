function isNullish(value: unknown) {
  return value === null || value === undefined;
}

function isObject(value: unknown) {
  return typeof value === "object" && value !== null;
}

function isOneOf<T extends unknown[]>(value: unknown, values: T): value is T[number] {
  return values.includes(value);
}

type Falsy = null | undefined | false | 0 | 0n | "";
type Truthy = Exclude<unknown, Falsy>;

function isFalsy(value: unknown): value is Falsy {
  return !value;
}

function isTruthy(value: unknown): value is Truthy {
  return !isFalsy(value);
}

export { isFalsy, isNullish, isObject, isOneOf, isTruthy };
export type { Falsy, Truthy };
