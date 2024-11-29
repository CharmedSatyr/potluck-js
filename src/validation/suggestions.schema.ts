import { z } from "zod";

export const suggestions = z.strictObject({
	advice: z.string().trim().max(500),
	dishes: z.array(
		z.object({
			type: z.string().trim().max(250),
			count: z.number().max(999),
		})
	),
});
