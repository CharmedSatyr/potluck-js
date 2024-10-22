import { z } from "zod";
import { Event, EVENT_CODE_LENGTH } from "@/db/schema/event";

export const schema = z
	.strictObject({
		code: z.string().trim().length(EVENT_CODE_LENGTH),
	})
	.required() satisfies z.ZodType<Pick<Event, "code">>;
