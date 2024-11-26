import findEvent from "@/actions/db/find-event";
import ManageEventWizard from "@/components/manage-event-wizard";
import { updateEventAction } from "./submit-actions";
import findSlots from "@/actions/db/find-slots";
import committedUsersBySlot from "@/components/committed-users-by-slot";
import { Suspense } from "react";
import { PlanEventFormFallback } from "@/components/plan-event-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ErrorBoundary from "@/components/error-boundary";

type Props = {
	params: Promise<{ code: string }>;
};

const EditEventPage = async ({ params }: Props) => {
	const session = await auth();

	const loggedIn = Boolean(session?.user?.id);

	const { code } = await params;

	if (!loggedIn) {
		redirect(`/event/${code}`);
	}

	return (
		<main className="flex h-full w-full flex-col items-center">
			<ErrorBoundary>
				<Suspense fallback={<PlanEventFormFallback />}>
					<ManageEventWizard
						code={code}
						committedUsersBySlotPromise={committedUsersBySlot(code)}
						eventDataPromise={findEvent({ code })}
						loggedIn={loggedIn}
						mode="edit"
						slotsPromise={findSlots({ code })}
						submitAction={updateEventAction}
					/>
				</Suspense>
			</ErrorBoundary>
		</main>
	);
};

export default EditEventPage;
