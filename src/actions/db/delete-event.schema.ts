import { z } from "zod";
import { Event } from "@/db/schema/event";
import { code } from "@/validation/code.schema";

export const schema = z
	.strictObject({
		code,
	})
	.required() satisfies z.ZodType<Pick<Event, "code">>;
