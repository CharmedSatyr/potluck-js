import findRequest from "@/actions/db/find-request";
import findEventByShortId from "@/actions/db/find-event-by-shortid";
import findCommitments from "@/actions/db/find-commitments";
import RequestManager from "@/app/event/[id]/request-manager";
import EventSkeleton from "@/components/event-skeleton";

interface Props {
	params: {
		id: string;
	};
}

const EventPage = async ({ params }: Props) => {
	const eventData = (await findEventByShortId(params.id)) ?? [];
	const requests = (await findRequest({ shortId: params.id })) ?? []; // TODO: Make consistent

	if (!eventData.length) {
		return <div>Event not found</div>;
	}

	const event = eventData[0];

	const commitments = await findCommitments(event.id);

	return (
		<div className="flex w-full flex-col justify-center">
			<EventSkeleton {...event} />
			<RequestManager commitments={commitments} requests={requests} />
		</div>
	);
};

export default EventPage;
