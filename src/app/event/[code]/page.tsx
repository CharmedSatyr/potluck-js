import findSlots from "@/actions/db/find-slots";
import findEvent from "@/actions/db/find-event";
import findCommitments from "@/actions/db/find-commitments";
import SlotManager from "@/app/event/[code]/(slot-manager)/index";
import EventSkeleton from "@/components/event-skeleton";
import findUsers from "@/actions/db/find-users";
import { auth } from "@/auth";
import committedUsersBySlot from "@/components/committed-users-by-slot";
import eventIsPassed from "@/utilities/event-is-passed";
import CommitmentsTable from "@/components/commitments-table";

type Props = {
	params: Promise<{ code: string }>;
};

const EventPage = async ({ params }: Props) => {
	const session = await auth();
	const authenticated = Boolean(session?.user?.id);

	const { code } = await params;
	// TODO: Use the new hotness (`use`) to pass these into components as promises.
	const [[event], slots, commitments] = await Promise.all([
		findEvent({ code }),
		findSlots({ eventCode: code }),
		findCommitments({ eventCode: code }),
	]);
	const committedUsersBySlotPromise = committedUsersBySlot(code);

	const usersToFind = commitments.map((c) => c.createdBy);
	const users =
		usersToFind.length > 0
			? await findUsers({ users: usersToFind as [string, ...string[]] })
			: [];

	const isPassed = eventIsPassed(event.startDate);

	return (
		<div className="flex w-full flex-col justify-center">
			<EventSkeleton {...event} />

			<h2 className="mb-0">Food Plan</h2>

			{authenticated && !isPassed && (
				<SlotManager
					committedUsersBySlotPromise={committedUsersBySlotPromise}
					commitments={commitments}
					slots={slots}
					users={users}
				/>
			)}

			{authenticated && isPassed && (
				<CommitmentsTable
					commitments={commitments}
					slots={slots}
					users={users}
				/>
			)}
		</div>
	);
};

export default EventPage;
