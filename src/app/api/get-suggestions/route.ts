import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
	try {
		const { eventData } = await req.json();

		const prompt = `
		Event Data:
		${eventData}

		Prompt:
		- Give one sentence of general advice for organizing a potluck event with the given data, 
		and suggest how many dishes of what type should be requested for the expected number of guests.

		- Please provide a JSON response with the format:
		{ "advice": string, "dishes": { "type": string; "count": number }[] }
		Do not wrap the JSON in backticks or a code block.
		`;

		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [{ role: "user", content: prompt }],
			max_tokens: 200,
		});

		console.log("Full response.choices:", response.choices);

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
