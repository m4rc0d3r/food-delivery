import * as z from "zod";

import { Id, LifeCycleDates } from "../common";

import { Password, PasswordHash } from "./attributes";

const zSchema = z
  .object({
    id: Id.zSchema,
    fullName: z.string().trim(),
    email: z.email(),
    phone: z.e164(),
    address: z.string().trim(),
    password: Password.zSchema,
    passwordHash: PasswordHash.zSchema,
  })
  .extend(LifeCycleDates.zSchema.shape);
type Schema = z.infer<typeof zSchema>;

export { zSchema };
export type { Schema };
