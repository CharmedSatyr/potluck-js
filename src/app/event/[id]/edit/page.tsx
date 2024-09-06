import findEventByEventCode from "@/actions/db/find-event-by-event-code";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import EditEventManager from "@/app/event/[id]/edit/edit-event-manager";

interface Props {
	params: {
		id: string;
	};
}

const EditEventPage = async ({ params }: Props) => {
	const session = await auth();

	const eventData = await findEventByEventCode(params.id);

	if (!eventData.length) {
		return <div>Event not found</div>;
	}
	const event = eventData[0];

	return (
		<SessionProvider session={session}>
			<div className="flex w-full justify-center">
				<EditEventManager {...event} />
			</div>
		</SessionProvider>
	);
};

export default EditEventPage;
