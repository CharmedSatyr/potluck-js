import { z } from "zod";

export const suggestionsSchema = z.strictObject({
	advice: z.string().trim().max(400).describe(`
			A helpful, unformatted message indicating an approach to meal planning
			for this event given the particular event details, and themed for Potluck Quest.
		`),
	slots: z
		.array(
			z.strictObject({
				count: z.number().max(999),
				id: z.string().uuid(),
				item: z.string().trim().max(500),
			})
		)
		.describe(
			"A list of types and counts of items the host should request from attendees."
		),
});
