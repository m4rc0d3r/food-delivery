import type ms from "ms";

import type { GenerateToken, VerifyToken } from "../ports";
import type { PayloadToSign, SignedPayload } from "../types";

class Service<
  T extends PayloadToSign = PayloadToSign,
  U extends SignedPayload<T> = SignedPayload<T>,
> {
  private readonly secret: string;
  private readonly lifetime: ms.StringValue;
  private readonly generateToken: GenerateToken.Fn<T, U>;
  private readonly verifyToken: VerifyToken.Fn<T>;

  constructor(
    secret: string,
    lifetime: ms.StringValue,
    generateToken: GenerateToken.Fn<T, U>,
    verifyToken: VerifyToken.Fn<T>,
  ) {
    this.secret = secret;
    this.lifetime = lifetime;
    this.generateToken = generateToken;
    this.verifyToken = verifyToken;
  }

  generate(payload: GenerateToken.In<T>["payload"]) {
    return this.generateToken({
      secret: this.secret,
      payload,
      lifetime: this.lifetime,
    });
  }

  verify(token: VerifyToken.In["token"]) {
    return this.verifyToken({
      secret: this.secret,
      token,
    });
  }
}

export { Service };
