import findSlots from "@/actions/db/find-slots";
import findEvent from "@/actions/db/find-event";
import findCommitments from "@/actions/db/find-commitments";
import SlotManager from "@/app/event/[code]/(slot-manager)/index";
import EventSkeleton, {
	EventSkeletonFallback,
} from "@/components/event-skeleton";
import findUsers from "@/actions/db/find-users";
import { auth } from "@/auth";
import committedUsersBySlot from "@/components/committed-users-by-slot";
import eventIsPassed from "@/utilities/event-is-passed";
import CommitmentsTable, {
	CommitmentsTableFallback,
} from "@/components/commitments-table";
import findRsvpsByEvent from "@/actions/db/find-rsvps-by-event";
import RsvpTable, { RsvpTableFallback } from "@/components/rsvp-table";
import { Rsvp } from "@/db/schema/rsvp";
import RsvpForm from "@/components/rsvp-form";
import Link from "next/link";
import { Suspense } from "react";

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

	// TODO: Make a query to get commitments with users.
	const usersToFind = commitments.map((c) => c.createdBy);
	const users =
		usersToFind.length > 0
			? await findUsers({ users: usersToFind as [string, ...string[]] })
			: [];

	const isPassed = eventIsPassed(event.startDate);

	// TODO: Make a query to get RSVPs with user data
	const rsvps = [
		{
			createdBy: event.createdBy,
			id: "1",
			message: "Event Host",
			response: "yes",
		} as Rsvp,
		...(await findRsvpsByEvent({ eventCode: code })),
	];

	const rsvpResponse =
		rsvps.find((r) => r.createdBy === session?.user?.id)?.response ?? null;

	const isHost = event.createdBy === session?.user?.id;

	return (
		<div className="grid-col-3 grid h-full w-full auto-rows-min">
			<div className="col-span-2 row-span-1">
				<Suspense fallback={<EventSkeletonFallback />}>
					<EventSkeleton code={code} />
				</Suspense>
			</div>

			<div className="col-span-1 row-span-1">
				{authenticated && isHost && !isPassed && (
					<Link
						className="btn btn-accent float-right w-full lg:w-1/2"
						href={`/event/${code}/edit`}
					>
						Edit
					</Link>
				)}

				{authenticated && !isHost && !isPassed && (
					<RsvpForm code={code} currentResponse={rsvpResponse} />
				)}
			</div>

			<div className="col-span-3 row-span-1">
				<h2>Attendees</h2>
				<Suspense fallback={<RsvpTableFallback />}>
					<RsvpTable code={code} />
				</Suspense>
			</div>

			<div className="col-span-3 row-span-1">
				{/** TODO: Delete commitments if someone changes RSVP to No. */}
				{authenticated &&
					!isPassed &&
					slots.length > 0 &&
					(isHost || rsvpResponse === "yes") && (
						<>
							<h2>Food Plan</h2>
							<SlotManager
								committedUsersBySlotPromise={committedUsersBySlotPromise}
								commitments={commitments}
								slots={slots}
								users={users}
							/>
						</>
					)}

				{authenticated &&
					slots.length > 0 &&
					(!isHost || isPassed) &&
					(isPassed || rsvpResponse !== "yes") && (
						<Suspense fallback={<CommitmentsTableFallback />}>
							<h2>Commitments</h2>
							<CommitmentsTable code={code} />
						</Suspense>
					)}
			</div>
		</div>
	);
};

export default EventPage;
