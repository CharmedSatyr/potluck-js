import { z } from "zod";
import { code } from "@/validation/code.schema";
import { Event } from "@/db/schema/event";
import { createdBy } from "@/validation/createdBy.schema";
import { Rsvp } from "@/db/schema/rsvp";

export const schema = z
	.strictObject({
		code,
		createdBy,
	})
	.required() satisfies z.ZodType<{
	code: Event["code"];
	createdBy: Rsvp["createdBy"];
}>;
