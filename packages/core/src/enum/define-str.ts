function defineStr<const T extends string[]>(members: T) {
  return Object.fromEntries(members.map((value) => [value, value])) as { [K in T[number]]: K };
}
type DefineStr<T extends Record<string, string>> = T[keyof T];

export { defineStr };
export type { DefineStr };
