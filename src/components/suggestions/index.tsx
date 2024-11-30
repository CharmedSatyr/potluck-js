"use chat";

import useItemSuggestions from "@/hooks/use-item-suggestions";
import { Dispatch, SetStateAction, useState } from "react";
import Results from "@/components/suggestions/results";
import Prompt from "@/components/suggestions/prompt";
import FailureWarning from "@/components/suggestions/failure-warning";

type Props = {
	attendees: string;
	code: string;
	setAttendees: Dispatch<SetStateAction<string>>;
	hookReturn: any;
};

const Suggestions = ({ attendees, code, hookReturn, setAttendees }: Props) => {
	const { suggestions: result, fetchSuggestions, pending, reset } = hookReturn;

	// TODO: Use a form/useActionState.

	if (!code) {
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

const SuggestionsContainer = ({ code }: { code: string }) => {
	const [attendees, setAttendees] = useState<string>("0");
	const hookReturn = useItemSuggestions(code, Number(attendees));

	return (
		<div className="rounded-xl bg-base-300 p-4 shadow-xl">
			<div
				className="transition-all duration-300 ease-in-out"
				style={{
					maxWidth: hookReturn.suggestions && !hookReturn.pending ? 560 : 420,
				}}
			>
				<Suggestions
					attendees={attendees}
					code={code}
					hookReturn={hookReturn}
					setAttendees={setAttendees}
				/>
			</div>
		</div>
	);
};

export default SuggestionsContainer;
