import { z } from "zod";
import { Event } from "@/db/schema/event";
import { createdBy } from "@/validation/createdBy.schema";
import { code } from "@/validation/code.schema";

export const schema = z
	.strictObject({
		createdBy,
		code,
	})
	.required() satisfies z.ZodType<Pick<Event, "createdBy" | "code">>;
