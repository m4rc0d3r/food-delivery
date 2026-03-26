import * as z from "zod";

const zConstraint = z.enum(["UNIQUE_USER_EMAIL", "UNIQUE_USER_PHONE"]);
const Constraint = zConstraint.enum;
type Constraint = z.infer<typeof zConstraint>;

export { Constraint };
