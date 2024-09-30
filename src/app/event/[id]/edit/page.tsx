import findEvent from "@/actions/db/find-event";
import EditEventManager from "@/app/event/[id]/edit/edit-event-manager";
import { UpdateEventFormData } from "./submit-actions.types";

type Props = {
	params: {
		id: string;
	};
};

const EditEventPage = async ({ params }: Props) => {
	const [event] = await findEvent({ code: params.id });

	if (!event) {
		return <div>Event not found</div>;
	}

	const {
		description,
		hosts,
		location,
		name,
		startDate,
		startTime,
	}: Required<UpdateEventFormData> = event;

	return (
		<div className="flex w-full justify-center">
			<EditEventManager
				code={params.id}
				currentValues={{
					description,
					hosts,
					location,
					name,
					startDate,
					startTime,
				}}
			/>
		</div>
	);
};

export default EditEventPage;
