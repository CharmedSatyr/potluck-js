"use client";

import { useState } from "react";
import { readStreamableValue } from "ai/rsc";
import { generateItemSuggestions } from "@/actions/ai/generate-item-suggestions";
import { PlanEventFormData } from "@/app/plan/submit-actions.schema";
import findEvent from "@/actions/db/find-event";

const useItemSuggestions = (code: string, attendees: number) => {
	const [pending, setPending] = useState(false);
	const [suggestions, setSuggestions] = useState<string>("");

	const reset = () => setSuggestions("");

	const fetchSuggestions = async () => {
		setPending(true);

		const [event] = await findEvent({ code });

		const { object } = await generateItemSuggestions(event, attendees);

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

export default useItemSuggestions;
