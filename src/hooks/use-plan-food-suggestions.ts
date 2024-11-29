"use client";

import { useState } from "react";

const usePlanFoodSuggestions = (eventData: object, attendees: number) => {
	const [pending, setPending] = useState(false);
	const [suggestions, setSuggestions] = useState<string | null>(null);

	const reset = () => setSuggestions(null);

	const fetchSuggestions = async () => {
		setPending(true);
		try {
			const response = await fetch("/api/get-suggestions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ eventData, attendees }),
			});

			if (!response.ok) {
				throw new Error("Failed to fetch suggestions");
			}

			const data = await response.json();

			setSuggestions(data.suggestions);
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setPending(false);
		}
	};

	return { suggestions, fetchSuggestions, pending, reset };
};

export default usePlanFoodSuggestions;
