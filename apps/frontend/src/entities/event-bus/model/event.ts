import { z } from "zod";

const zEvent = z.object({
  userNotAuthenticated: z.void(),
});
type Event = z.infer<typeof zEvent>;

export { zEvent };
export type { Event };
