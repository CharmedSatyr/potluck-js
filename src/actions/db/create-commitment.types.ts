import { z } from "zod";
import { Commitment } from "@/db/schema/commitment";

export const schema = z
	.strictObject({
		createdBy: z.string().trim().uuid(),
		description: z.string().trim().max(256),
		quantity: z.coerce.number().positive().max(256),
		requestId: z.string().trim().uuid(),
	})
	.required() satisfies z.ZodType<
	Pick<Commitment, "createdBy" | "description" | "quantity" | "requestId">
>;
