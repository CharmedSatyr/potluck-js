"use client";

import { useState } from "react";
import { readStreamableValue } from "ai/rsc";
import { generateSlotSuggestions } from "@/actions/ai/generate-slot-suggestions";
import { EventData } from "@/@types/event";

const useSlotSuggestions = (eventData: EventData, attendees: number) => {
	const [pending, setPending] = useState(false);
	const [suggestions, setSuggestions] = useState<string>("");

	const reset = () => setSuggestions("");

	const fetchSuggestions = async () => {
		setPending(true);

		try {
			const { object } = await generateSlotSuggestions(eventData, attendees);

			for await (const partialObject of readStreamableValue(object)) {
				if (!partialObject) {
					return;
				}

				setSuggestions(JSON.stringify(partialObject, null, 2));
			}
		} catch (err) {
			console.error(err);
		} finally {
			setPending(false);
		}
	};

	return { suggestions, fetchSuggestions, pending, reset };
};

export default useSlotSuggestions;
