import { z } from "zod";
import { Event } from "@/@types/event";
import { code } from "@/validation/code.schema";
import { Rsvp } from "@/db/schema/rsvp";
import { User } from "@/db/schema/auth/user";

export const schema = z
	.strictObject({
		code: code,
		createdBy: z.string().trim().uuid(),
		message: z.string().trim().max(256),
		response: z.enum(["yes", "no"]),
	})
	.required() satisfies z.ZodType<{
	code: Event["code"];
	createdBy: User["id"];
	message: Rsvp["message"];
	response: Rsvp["response"];
}>;
