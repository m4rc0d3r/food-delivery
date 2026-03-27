type Values<T extends Record<PropertyKey, unknown>> = T[keyof T];

export type { Values };
