"use client";

import { EventUserValues } from "@/db/schema/event";
import usePlanFoodSuggestions from "@/hooks/use-plan-food-suggestions";

const PlanFoodSuggestions = ({ eventData }: { eventData: EventUserValues }) => {
	const { suggestions, fetchSuggestions, loading } =
		usePlanFoodSuggestions(eventData);

	return (
		<div>
			<h1>{eventData.name}</h1>
			<button
				className="btn btn-lg"
				onClick={fetchSuggestions}
				disabled={loading}
				type="button"
			>
				{loading ? "Loading..." : "Get Dish Suggestions"}
			</button>
			{suggestions && (
				<div>
					<h2>Suggestions:</h2>
					<p>{suggestions}</p>
				</div>
			)}
		</div>
	);
};

export default PlanFoodSuggestions;
