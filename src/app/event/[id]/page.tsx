import findRequests from "@/actions/db/find-requests";
import findEvent from "@/actions/db/find-event";
import findCommitments from "@/actions/db/find-commitments";
import RequestManager from "@/app/event/[id]/request-manager";
import EventSkeleton from "@/components/event-skeleton";
import findUsers from "@/actions/db/find-users";

interface Props {
	params: {
		id: string;
	};
}

const EventPage = async ({ params }: Props) => {
	const [[event], requests, commitments] = await Promise.all([
		findEvent({ code: params.id }),
		findRequests({ eventCode: params.id }),
		findCommitments({ eventCode: params.id }),
	]);

	const usersToFetch = commitments.map((c) => c.createdBy);
	const users = await findUsers({ users: usersToFetch });

	return (
		<div className="flex w-full flex-col justify-center">
			<EventSkeleton {...event!} />
			<RequestManager
				commitments={commitments}
				requests={requests}
				users={users}
			/>
		</div>
	);
};

export default EventPage;
