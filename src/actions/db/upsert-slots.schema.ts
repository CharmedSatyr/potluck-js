import { z } from "zod";
import { code } from "@/validation/code.schema";
import { Event } from "@/db/schema/event";
import { CustomizableSlotValues, Slot } from "@/db/schema/slot";

type CustomizableSlotValuesWithId = CustomizableSlotValues & {
	id: Slot["id"];
};

export const schema = z
	.strictObject({
		code: code,
		slots: z
			.array(
				z.strictObject({
					count: z.number().positive(),
					id: z.string().trim().uuid(),
					item: z.string().trim().min(1),
				})
			)
			.nonempty(),
	})
	.required() satisfies z.ZodType<{
	code: Event["code"];
	slots: CustomizableSlotValuesWithId[];
}>;
