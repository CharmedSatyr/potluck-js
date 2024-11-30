"use chat";

import usePlanFoodSuggestions from "@/hooks/use-plan-food-suggestions";
import { Dispatch, SetStateAction, useState } from "react";
import Results from "@/components/suggestions/results";
import Prompt from "@/components/suggestions/prompt";
import FailureWarning from "@/components/suggestions/failure-warning";

type Props = {
	attendees: string;
	setAttendees: Dispatch<SetStateAction<string>>;
	eventData: {
		name: string;
		description: string;
		hosts: string;
		location: string;
		startDate: string;
		startTime: string;
	};
	hookReturn: any;
};

const Suggestions = ({
	attendees,
	setAttendees,
	eventData,
	hookReturn,
}: Props) => {
	const { suggestions: result, fetchSuggestions, pending, reset } = hookReturn;

	// TODO: Use a form/useActionState.

	if (!eventData) {
		return null;
	}

	if (result && !pending) {
		try {
			const suggestions = JSON.parse(result);
			return <Results suggestions={suggestions} reset={reset} />;
		} catch (err) {
			console.log("Failed to fetch AI suggestions", err);

			return (
				<FailureWarning errorMessage={JSON.stringify(err)} reset={reset} />
			);
		}
	}

	return (
		<Prompt
			attendees={attendees}
			fetchSuggestions={fetchSuggestions}
			pending={pending}
			setAttendees={setAttendees}
		/>
	);
};

const SuggestionsContainer = ({
	eventData,
}: {
	eventData: Props["eventData"];
}) => {
	const [attendees, setAttendees] = useState<string>("0");
	const hookReturn = usePlanFoodSuggestions(eventData, Number(attendees));

	return (
		<div className="rounded-lg bg-base-300 p-8 shadow-xl">
			<div
				className="transition-all duration-300 ease-in-out"
				style={{
					maxWidth: hookReturn.suggestions ? "screen" : "400px",
				}}
			>
				<Suggestions
					attendees={attendees}
					setAttendees={setAttendees}
					eventData={eventData}
					hookReturn={hookReturn}
				/>
			</div>
		</div>
	);
};

export default SuggestionsContainer;
