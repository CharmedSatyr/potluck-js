import { z } from "zod";
import { code } from "@/actions/db/shared-types";
import { Event } from "@/db/schema/event";
import { CustomizableRequestValues, Request } from "@/db/schema/request";

type CustomizableRequestValuesWithId = CustomizableRequestValues & {
	id: Request["id"];
};

export const schema = z
	.strictObject({
		code: code,
		requests: z
			.array(
				z.strictObject({
					count: z.number().positive(),
					course: z.string().trim().min(1),
					id: z.string().trim().uuid(),
				})
			)
			.nonempty(),
	})
	.required() satisfies z.ZodType<{
	code: Event["code"];
	requests: CustomizableRequestValuesWithId[];
}>;
