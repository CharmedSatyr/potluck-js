"use client";

import { useState } from "react";
import { readStreamableValue } from "ai/rsc";
import { generateItemSuggestions as generateSlotSuggestions } from "@/actions/ai/generate-slot-suggestions";
import findEvent from "@/actions/db/find-event";

const useSlotSuggestions = (code: string, attendees: number) => {
	const [pending, setPending] = useState(false);
	const [suggestions, setSuggestions] = useState<string>("");

	const reset = () => setSuggestions("");

	const fetchSuggestions = async () => {
		setPending(true);

		const [event] = await findEvent({ code });

		const { object } = await generateSlotSuggestions(event, attendees);

		for await (const partialObject of readStreamableValue(object)) {
			if (!partialObject) {
				return;
			}

			setSuggestions(JSON.stringify(partialObject, null, 2));
		}

		setPending(false);
	};

	return { suggestions, fetchSuggestions, pending, reset };
};

export default useSlotSuggestions;
