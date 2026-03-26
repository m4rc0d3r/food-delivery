import * as z from "zod";

const zConstraint = z.enum(["UNIQUE_COUPON_CODE"]);
const Constraint = zConstraint.enum;
type Constraint = z.infer<typeof zConstraint>;

export { Constraint };
