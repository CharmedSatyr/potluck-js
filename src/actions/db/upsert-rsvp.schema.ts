import { z } from "zod";
import { code } from "@/validation/code.schema";
import { Event } from "@/db/schema/event";
import { Rsvp } from "@/db/schema/rsvp";
import { User } from "@/db/schema/auth/user";

export const schema = z
	.strictObject({
		code: code,
		createdBy: z.string().trim().uuid(),
		response: z.enum(["attending", "not attending"]),
	})
	.required() satisfies z.ZodType<{
	code: Event["code"];
	createdBy: User["id"];
	response: Rsvp["response"];
}>;
