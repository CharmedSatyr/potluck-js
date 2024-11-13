import { z } from "zod";
import { Event } from "@/db/schema/event";

export const schema = z
	.strictObject({
		createdBy: z.string().trim().uuid(),
	})
	.required() satisfies z.ZodType<Pick<Event, "createdBy">>;
