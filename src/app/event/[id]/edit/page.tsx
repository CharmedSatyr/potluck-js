import findEvent from "@/actions/db/find-event";
import EditEventManager from "@/app/event/[id]/edit/edit-event-manager";

interface Props {
	params: {
		id: string;
	};
}

const EditEventPage = async ({ params }: Props) => {
	const event = await findEvent(params.id);

	if (!event) {
		return <div>Event not found</div>;
	}

	return (
		<div className="flex w-full justify-center">
			<EditEventManager {...event} />
		</div>
	);
};

export default EditEventPage;
