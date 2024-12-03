"use server";

import { streamObject } from "ai";
import { createStreamableValue } from "ai/rsc";
import { suggestionsSchema } from "@/validation/suggestions.schema";
import { EventData } from "@/@types/event";

import dotenv from "dotenv";
dotenv.config();

export const generateItemSuggestions = async (
	eventData: EventData,
	attendees: number
) => {
	const openai = require("@ai-sdk/openai").configure({
		apiKey: process.env.OPENAI_API_KEY,
	});

	const stream = createStreamableValue();

	const system = `
  You are a helpful assistant for Potluck Quest, a fantasy-themed application designed to help users plan potluck meals.
  Your goal is to generate clear, creative, and tailored suggestions based on user-provided event details.
`;

	const prompt = `
  A user needs assistance planning their potluck event. Here are the details:
  
  - **Event Title**: ${eventData.title}
  - **Description**: ${eventData.description}
  - **Hosted by**: ${eventData.hosts}
  - **Location**: ${eventData.location}
  - **Start Time**: ${eventData.startTime} on ${eventData.startDate}
  - **Number of Attendees**: ${attendees}

  Based on these details:
  1. Provide a brief paragraph offering general advice and tips for the event, tailored to the type of the gathering. This section should:
     - Be conversational and engaging.
     - Avoid listing specific items.
     - Avoid restating the location if it appears to be a street address.
     - Highlight themes or special considerations based on the name and description, where applicable (e.g., birthday parties, holidays, dietary preferences).

  2. Separately, provide a detailed table-like breakdown of the exact items to request from attendees. For each item type (e.g., main dishes, sides, desserts, beverages, supplies), suggest quantities proportional to the number of attendees. This list should:
     - Avoid repeating information from the advice section.
     - Potentially provide examples of creative, theme-appropriate dish ideas.
     - Do not include the count in the type field.
     - Be concise and specific.

  The response should be easy to parse, with the advice and items clearly separated.
`;

	(async () => {
		const { partialObjectStream } = streamObject({
			model: openai("gpt-4o-mini"),
			system,
			prompt,
			schema: suggestionsSchema,
		});

		console.log("partialObjectStream:", partialObjectStream);

		for await (const partialObject of partialObjectStream) {
			console.log("partialObject:", partialObject);
			stream.update(partialObject);
		}

		stream.done();
	})();

	console.log("stream", JSON.stringify(stream));
	return { object: stream.value };
};
