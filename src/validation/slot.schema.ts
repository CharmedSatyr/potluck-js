import { z } from "zod";

export const schema = z
	.strictObject({
		count: z.coerce.number().positive(),
		id: z.string().uuid().optional(),
		item: z.string().trim().min(1),
		order: z.coerce.number().positive(),
	})
	.strip();
