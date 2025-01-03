import useSlotSuggestions from "@/hooks/use-slot-suggestions";
import { Dispatch, SetStateAction, useState } from "react";
import Results from "@/components/suggestions/results";
import Prompt from "@/components/suggestions/prompt";
import FailureWarning from "@/components/suggestions/failure-warning";
import { EventData, EventInput } from "@/@types/event";
import { SlotData } from "@/@types/slot";

type Props = {
	attendees: string;
	hookReturn: {
		suggestions: string;
		fetchSuggestions: () => Promise<void>;
		pending: boolean;
		reset: () => void;
	};
	populate: (items: SlotData[]) => void;
	setAttendees: Dispatch<SetStateAction<string>>;
};

const Suggestions = ({
	attendees,
	hookReturn,
	populate,
	setAttendees,
}: Props) => {
	const { suggestions: result, fetchSuggestions, pending, reset } = hookReturn;

	// TODO: Use a form/useActionState?
	if (result && !pending) {
		try {
			const suggestions = JSON.parse(result);
			return (
				<Results populate={populate} reset={reset} suggestions={suggestions} />
			);
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

// TODO: not unknown.
const SuggestionsContainer = ({
	eventInput,
	populate,
}: {
	eventInput: EventInput;
	populate: (items: SlotData[]) => void;
}) => {
	const [attendees, setAttendees] = useState<string>("0");
	const hookReturn = useSlotSuggestions(eventInput, Number(attendees));

	if (!eventInput) {
		return null;
	}

	return (
		<div className="rounded-xl bg-base-300 shadow-xl md:p-4">
			<div
				className="transition-all duration-300 ease-in-out"
				style={{
					maxWidth: hookReturn.suggestions && !hookReturn.pending ? 560 : 420,
				}}
			>
				<Suggestions
					attendees={attendees}
					hookReturn={hookReturn}
					populate={populate}
					setAttendees={setAttendees}
				/>
			</div>
		</div>
	);
};

export default SuggestionsContainer;
