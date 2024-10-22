import findEvent from "@/actions/db/find-event";
import EditEventManager from "@/app/event/[id]/edit/edit-event-manager";
import { UpdateEventFormData } from "./submit-actions.types";

type Props = {
	params: Promise<{ id: string }>;
};

const EditEventPage = async ({ params }: Props) => {
	const { id } = await params;
	const [event] = await findEvent({ code: id });

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
				code={id}
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
