type BaseErrorOptions = {
  message?: string | undefined;
  cause?: unknown;
};

abstract class BaseError<T extends boolean> extends Error {
  readonly isOperational: T;

  constructor(isOperational: T, options?: BaseErrorOptions) {
    super(options?.message, {
      cause: options?.cause,
    });
    this.isOperational = isOperational;
  }
}

export { BaseError };
export type { BaseErrorOptions };
