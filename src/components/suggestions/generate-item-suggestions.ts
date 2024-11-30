"use server";

import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";
import { suggestionsSchema } from "@/validation/suggestions.schema";
import { PlanEventFormData } from "@/app/plan/submit-actions.schema";

export async function generate(
	eventData: PlanEventFormData,
	attendees: number
) {
	const stream = createStreamableValue();

	const system = `
		You are being asked to help users of Potluck Quest,
    	a fantasy-themed application intended to help groups plan potluck meals.
    	Although it may be used by players at a tabletop game session,
		anyone can use Potluck Quest!
	`;

	const prompt = `
		A user has indicated they need help planning their meal.

		- They expect ${attendees} attendees to be present.
		- The name of their event is ${eventData.name}.
		- The following description of the event has been provided: ${eventData.description}.
		- The event is being hosted by ${eventData.hosts}.
		- The event's location has been listed as ${eventData.location}.
		- The event will start at ${eventData.startTime} on ${eventData.startDate}.

		Provide advice about the type and number of items (dishes, drinks, utensils, etc.)
		they should request from attendees, given the expected number attending.
		
		Use the event details to make appropriate and creative suggestions.
		For example, if it's a birthday party, it might be a good idea
		for someone to bring a cake or cupcakes, candles, etc.
	`;

	(async () => {
		const { partialObjectStream } = streamObject({
			model: openai("gpt-4o-mini"),
			system,
			prompt,
			schema: suggestionsSchema,
		});

		for await (const partialObject of partialObjectStream) {
			stream.update(partialObject);
		}

		stream.done();
	})();

	return { object: stream.value };
}
