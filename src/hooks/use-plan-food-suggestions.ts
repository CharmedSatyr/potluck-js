"use client";

import { useState } from "react";

const usePlanFoodSuggestions = (eventData: object) => {
	const [loading, setLoading] = useState(false);
	const [suggestions, setSuggestions] = useState<string | null>(null);

	const fetchSuggestions = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/get-suggestions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ eventData }),
			});

			if (!response.ok) {
				throw new Error("Failed to fetch suggestions");
			}

			const data = await response.json();

			setSuggestions(data.suggestions);
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	};

	return { suggestions, fetchSuggestions, loading };
};

export default usePlanFoodSuggestions;
