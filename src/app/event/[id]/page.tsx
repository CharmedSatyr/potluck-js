"use server";

import findRequests from "@/actions/db/find-requests";
import findEvent from "@/actions/db/find-event";
import findCommitments from "@/actions/db/find-commitments";
import RequestManager from "@/app/event/[id]/request-manager";
import EventSkeleton from "@/components/event-skeleton";
import findUsers from "@/actions/db/find-users";

type Props = {
	params: {
		id: string;
	};
};

const EventPage = async ({ params }: Props) => {
	const { id } = await params; // NOSONAR - await required
	const [[event], requests, commitments] = await Promise.all([
		findEvent({ code: id }),
		findRequests({ eventCode: id }),
		findCommitments({ eventCode: id }),
	]);

	const usersToFind = commitments.map((c) => c.createdBy);
	const users =
		usersToFind.length > 0 ? await findUsers({ users: usersToFind }) : [];

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
