import { Event } from "@/db/schema/event";
import { z } from "zod";
import { code } from "@/actions/db/shared-types";

export const schema = z
	.strictObject({
		eventCode: code,
	})
	.required() satisfies z.ZodType<{ eventCode: Event["code"] }>;
