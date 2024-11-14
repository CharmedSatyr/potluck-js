import { Event } from "@/db/schema/event";
import { z } from "zod";
import { code } from "@/validation/code.schema";

export const schema = z
	.strictObject({
		eventCode: code,
	})
	.required() satisfies z.ZodType<{ eventCode: Event["code"] }>;
