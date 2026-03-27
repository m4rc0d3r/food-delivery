import type { Domain } from "@workspace/core";

type AuthTokenPayload = {
  userId: Domain.User.Schema["id"];
};

export type { AuthTokenPayload };
