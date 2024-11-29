import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
	try {
		const { eventData, attendees } = await req.json();

		const prompt = `
		You are being used to help users of Potluck Quest, a fantasy-themed application intended to help groups plan potluck meals.
		Although it may be used by players at a tabletop game session, anyone can use it!

		The user has indicated they need help planning their meal.

		They expect ${attendees} attendees to be present.

		The name of this event is ${eventData.name}.
		The following description of the event has been provided: ${eventData.description}.
		The event is being hosted by ${eventData.hosts} (this is probably the user who needs planning help).
		The event's location has been listed as ${eventData.location} and will start at ${eventData.startTime} on ${eventData.startDate}.

		Provide advice about the type and number of items (dishes, drinks, utensils, etc.) they should request from attendees,
		given the expected number attending. Expect the location to be a personal residence unless otherwise indicated.
		Use the event details to make appropriate and creative suggestions. For example, if it's a birthday party, it might be a good
		idea for someone to bring a cake or cupcakes, candles, etc.

		Please provide a JSON response with the format:
		{ "advice": string, "dishes": { "type": string; "count": number }[] }
		Do not wrap the JSON in backticks or a code block.
		`;

		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [{ role: "user", content: prompt }],
			max_tokens: 200,
		});

		return NextResponse.json({
			suggestions: response.choices[0].message.content,
		});
	} catch (error) {
		console.error("Error fetching suggestions:", error);
		return NextResponse.json(
			{ error: "Failed to get suggestions" },
			{ status: 500 }
		);
	}
}
