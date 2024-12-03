import { z } from "zod";
import { SlotData } from "@/@types/slot";
import { Event } from "@/db/schema/event";
import { code } from "@/validation/code.schema";

export const schema = z
	.strictObject({
		code,
		slots: z
			.array(
				z.strictObject({
					count: z.number().positive(),
					item: z.string().trim().min(1),
				})
			)
			.nonempty(),
	})
	.required() satisfies z.ZodType<{
	code: Event["code"];
	slots: SlotData[];
}>;
