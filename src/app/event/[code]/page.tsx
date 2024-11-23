import findEvent from "@/actions/db/find-event";
import SlotManager, { SlotManagerFallback } from "@/components/slot-manager";
import EventSkeleton, {
	EventHeader,
	EventSkeletonFallback,
} from "@/components/event-skeleton";
import { auth } from "@/auth";
import eventIsPassed from "@/utilities/event-is-passed";
import CommitmentsTable, {
	CommitmentsTableFallback,
} from "@/components/commitments-table";
import RsvpTable, { RsvpTableFallback } from "@/components/rsvp-table";
import RsvpForm, { RsvpFormFallback } from "@/components/rsvp-form";
import Link from "next/link";
import { PropsWithChildren, Suspense } from "react";
import findUserEventRsvp from "@/actions/db/find-user-event-rsvp";
import findCommitmentsWithDetails from "@/actions/db/find-commitments-with-details";
import { notFound } from "next/navigation";
import SlideIn from "@/components/slide-in";
import DeleteEventButton from "@/components/delete-event-button";

type Props = { params: Promise<{ code: string }> };

const Container = ({ children }: PropsWithChildren) => (
	<main className="container flex h-full w-full flex-wrap lg:w-3/4 2xl:w-1/2">
		{children}
	</main>
);

const EventTitleSection = ({ code }: { code: string }) => (
	<section className="w-full">
		<EventHeader code={code} name="Something's Happening..." />
		<p>Sign in to see all the details!</p>
	</section>
);

const EventSection = ({ code }: { code: string }) => (
	<section className="min-h-72 w-full md:w-2/3">
		<Suspense fallback={<EventSkeletonFallback />}>
			<EventSkeleton code={code} />
		</Suspense>
	</section>
);

const AttendeesSection = ({ code }: { code: string }) => (
	<section className="w-full">
		<SlideIn>
			<h2>Attendees</h2>
			<Suspense fallback={<RsvpTableFallback />}>
				<RsvpTable code={code} />
			</Suspense>
		</SlideIn>
	</section>
);

const CommitmentsSection = async ({ code }: { code: string }) => (
	<section className="w-full">
		<SlideIn>
			<h2>On the Menu</h2>
			<Suspense fallback={<CommitmentsTableFallback />}>
				<CommitmentsTable
					commitmentsWithDetails={await findCommitmentsWithDetails({
						code,
					})}
				/>
			</Suspense>
		</SlideIn>
	</section>
);

const ManageEventSection = ({ code }: { code: string }) => (
	<section className="flex w-full flex-col gap-2 md:w-1/3 md:items-end md:justify-start">
		<Link className="btn btn-accent md:w-28" href={`/event/${code}/edit`}>
			Edit
		</Link>
		<DeleteEventButton code={code} />
	</section>
);

// TODO: Delete commitments if someone changes RSVP to No.
const RsvpSection = ({ code, userId }: { code: string; userId: string }) => (
	<section className="w-full md:w-1/3">
		<Suspense fallback={<RsvpFormFallback />}>
			<RsvpForm
				code={code}
				currentRsvpPromise={findUserEventRsvp({
					code,
					createdBy: userId,
				})}
			/>
		</Suspense>
	</section>
);

const FoodPlanSection = ({ code }: { code: string }) => {
	return (
		<section className="w-full">
			<SlideIn>
				<h2>On the Menu</h2>
				<Suspense fallback={<SlotManagerFallback />}>
					<SlotManager code={code} />
				</Suspense>
			</SlideIn>
		</section>
	);
};

const LoggedOutView = ({ code }: { code: string }) => (
	<Container>
		<EventTitleSection code={code} />
	</Container>
);

const PassedView = ({ code }: { code: string }) => (
	<Container>
		<EventSection code={code} />
		<CommitmentsSection code={code} />
		<AttendeesSection code={code} />
	</Container>
);

const HostView = async ({ code }: { code: string }) => (
	<Container>
		<EventSection code={code} />
		<ManageEventSection code={code} />
		<FoodPlanSection code={code} />
		<AttendeesSection code={code} />
	</Container>
);

const GuestView = async ({
	code,
	userId,
}: {
	code: string;
	userId: string;
}) => (
	<Container>
		<EventSection code={code} />
		<RsvpSection code={code} userId={userId} />
		<FoodPlanSection code={code} />
		<AttendeesSection code={code} />
	</Container>
);

const EventPage = async ({ params }: Props) => {
	const { code } = await params;

	const [event] = await findEvent({ code });

	if (!event) {
		return notFound();
	}

	const session = await auth();

	if (!session?.user?.id) {
		return <LoggedOutView code={code} />;
	}

	if (eventIsPassed(event.startDate)) {
		return <PassedView code={code} />;
	}

	if (event.createdBy === session.user.id) {
		return <HostView code={code} />;
	}

	const [rsvpResponse] = await findUserEventRsvp({
		code,
		createdBy: session.user.id,
	});

	if (rsvpResponse?.response === "yes") {
		return <GuestView code={code} userId={session.user.id} />;
	}

	return (
		<Container>
			<EventSection code={code} />
			<RsvpSection code={code} userId={session.user.id} />
			<CommitmentsSection code={code} />
			<AttendeesSection code={code} />
		</Container>
	);
};

export default EventPage;
