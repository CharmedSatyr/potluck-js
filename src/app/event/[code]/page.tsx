import findRequests from "@/actions/db/find-requests";
import findEvent from "@/actions/db/find-event";
import findCommitments from "@/actions/db/find-commitments";
import RequestManager from "@/app/event/[code]/request-manager";
import EventSkeleton from "@/components/event-skeleton";
import findUsers from "@/actions/db/find-users";

type Props = {
	params: Promise<{ code: string }>;
};

const EventPage = async ({ params }: Props) => {
	const { code } = await params;
	// TODO: Use the new hotness (`use`) to pass these into components as promises.
	const [[event], requests, commitments] = await Promise.all([
		findEvent({ code }),
		findRequests({ eventCode: code }),
		findCommitments({ eventCode: code }),
	]);

	const usersToFind = commitments.map((c) => c.createdBy);
	const users =
		usersToFind.length > 0
			? await findUsers({ users: usersToFind as [string, ...string[]] })
			: [];

	return (
		<div className="flex w-full flex-col justify-center">
			<EventSkeleton {...event} />
			<RequestManager
				commitments={commitments}
				requests={requests}
				users={users}
			/>
		</div>
	);
};

export default EventPage;