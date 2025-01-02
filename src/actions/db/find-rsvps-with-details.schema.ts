import { z } from "zod";
import { Event } from "@/@types/event";
import { code } from "@/validation/code.schema";

export const schema = z
	.strictObject({
		code,
	})
	.required() satisfies z.ZodType<{ code: Event["code"] }>;
