import { z } from "zod";
import { code } from "@/schemas/code.schema";
import { Event } from "@/db/schema/event";

export const schema = z
	.strictObject({
		code,
	})
	.required() satisfies z.ZodType<Pick<Event, "code">>;
