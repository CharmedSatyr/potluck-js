import findEvent from "@/actions/db/find-event";
import ManageEventWizard from "@/components/manage-event-wizard";
import { updateEventAction } from "./submit-actions";
import findSlots from "@/actions/db/find-slots";
import committedUsersBySlot from "@/components/committed-users-by-slot";
import { Suspense } from "react";
import { PlanEventFormFallback } from "@/components/plan-event-form";

type Props = {
	params: Promise<{ code: string }>;
};

const EditEventPage = async ({ params }: Props) => {
	const { code } = await params;

	return (
		<main className="flex h-full w-full flex-col items-center">
			<Suspense fallback={<PlanEventFormFallback />}>
				<ManageEventWizard
					code={code}
					committedUsersBySlotPromise={committedUsersBySlot(code)}
					eventDataPromise={findEvent({ code })}
					slotsPromise={findSlots({ code })}
					submitAction={updateEventAction}
				/>
			</Suspense>
		</main>
	);
};

export default EditEventPage;
