import * as z from "zod";

const zSchema = z.enum(["FIXED", "PERCENT"]);
const Schema = zSchema.enum;
type Schema = z.infer<typeof zSchema>;

export { Schema, zSchema };
