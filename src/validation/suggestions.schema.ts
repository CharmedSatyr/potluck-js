import { z } from "zod";

export const suggestionsSchema = z.strictObject({
	advice: z.string().trim().max(500).describe(`
			A helpful, unformatted message indicating an approach to meal planning
			for this event given the particular event details, and themed for Potluck Quest.
		`),
	items: z
		.array(
			z.strictObject({
				type: z.string().trim().max(250),
				count: z.number().max(999),
			})
		)
		.describe(
			"A list of types and counts of items the host should request from attendees."
		),
});
