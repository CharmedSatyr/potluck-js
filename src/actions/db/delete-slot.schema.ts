import { z } from "zod";
import { Slot } from "@/db/schema/slot";

export const schema = z
	.strictObject({
		id: z.string().trim().uuid(),
	})
	.required() satisfies z.ZodType<Pick<Slot, "id">>;
