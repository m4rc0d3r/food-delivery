type PayloadToSign = Record<string, unknown>;

type SignedPayload<T extends PayloadToSign> = T & {
  exp: number;
  iat: number;
};

export type { PayloadToSign, SignedPayload };
