import findEvent from "@/actions/db/find-event";
import EditEventManager from "@/app/event/[code]/edit/edit-event-manager";
import { UpdateEventFormData } from "./submit-actions.types";

type Props = {
	params: Promise<{ code: string }>;
};

const EditEventPage = async ({ params }: Props) => {
	const { code } = await params;
	const [event] = await findEvent({ code: code });

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
				code={code}
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