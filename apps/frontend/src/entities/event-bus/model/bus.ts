import type { Emitter } from "mitt";

import type { Event } from "./event";

type Bus = Emitter<Event>;

export type { Bus };
