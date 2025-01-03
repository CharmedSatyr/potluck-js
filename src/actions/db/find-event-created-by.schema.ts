import { z } from "zod";
import { code } from "@/validation/code.schema";
import { Event } from "@/@types/event";

export const schema = z
	.strictObject({
		code,
	})
	.required() satisfies z.ZodType<Pick<Event, "code">>;
