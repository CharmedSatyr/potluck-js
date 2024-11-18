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
import RsvpTable, { RsvpTableFallback } from "@/components/rsvp-table";
import RsvpForm, { RsvpFormFallback } from "@/components/rsvp-form";
import Link from "next/link";
import { Suspense } from "react";
import findUserEventRsvp from "@/actions/db/find-user-event-rsvp";

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

	const isHost = event.createdBy === session?.user?.id;

	const [rsvpResponse] = await findUserEventRsvp({
		code,
		createdBy: session!.user!.id!,
	});

	// TODO: Make this better.
	const isVisible = {
		attendees: authenticated,
		commitmentsTable:
			authenticated &&
			slots.length > 0 &&
			(isPassed || rsvpResponse?.response !== "yes") &&
			(!isHost || isPassed),
		rsvpForm: authenticated && !isHost && !isPassed,
		editButton: authenticated && isHost && !isPassed,
		slotManager:
			authenticated &&
			slots.length > 0 &&
			(isHost || rsvpResponse?.response === "yes") &&
			!isPassed,
	};

	return (
		<div className="grid-col-3 grid h-full w-full auto-rows-min lg:w-3/4 2xl:w-1/2">
			<section className="col-span-2 row-span-1">
				<Suspense fallback={<EventSkeletonFallback />}>
					<EventSkeleton code={code} />
				</Suspense>
			</section>

			<section className="col-span-1 row-span-1">
				{isVisible.editButton && (
					<Link
						className="btn btn-accent float-right w-full lg:w-1/2"
						href={`/event/${code}/edit`}
					>
						Edit
					</Link>
				)}

				{isVisible.rsvpForm && (
					<Suspense fallback={<RsvpFormFallback />}>
						<RsvpForm
							code={code}
							currentRsvpPromise={findUserEventRsvp({
								code,
								createdBy: session!.user!.id!,
							})}
						/>
					</Suspense>
				)}
			</section>

			{isVisible.attendees && (
				<section className="col-span-3 row-span-1">
					<h2>Attendees</h2>
					<Suspense fallback={<RsvpTableFallback />}>
						<RsvpTable code={code} />
					</Suspense>
				</section>
			)}

			{/** TODO: Delete commitments if someone changes RSVP to No. */}
			<section className="col-span-3 row-span-1">
				{isVisible.slotManager && (
					<Suspense>
						<h2>Food Plan</h2>
						<SlotManager
							committedUsersBySlotPromise={committedUsersBySlotPromise}
							commitments={commitments}
							slots={slots}
							users={users}
						/>
					</Suspense>
				)}

				{isVisible.commitmentsTable && (
					<Suspense fallback={<CommitmentsTableFallback />}>
						<h2>Commitments</h2>
						<CommitmentsTable code={code} />
					</Suspense>
				)}
			</section>
		</div>
	);
};

export default EventPage;
