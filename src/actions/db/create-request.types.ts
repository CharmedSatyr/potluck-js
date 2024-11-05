import { CustomizableRequestValues } from "@/db/schema/request";
import { z } from "zod";
import { Event } from "@/db/schema/event";
import { code } from "@/actions/db/shared-types";

export const schema = z
	.strictObject({
		code: code,
		requests: z
			.array(
				z.strictObject({
					count: z.number().positive(),
					course: z.string().trim().min(1),
				})
			)
			.nonempty(),
	})
	.required() satisfies z.ZodType<{
	code: Event["code"];
	requests: CustomizableRequestValues[];
}>;
