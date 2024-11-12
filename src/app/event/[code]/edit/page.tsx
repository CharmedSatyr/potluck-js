import findEvent from "@/actions/db/find-event";
import ManageEventWizard from "@/components/manage-event-wizard";
import { updateEventAction } from "./submit-actions";
import findSlots from "@/actions/db/find-slots";
import committedUsersBySlot from "@/components/committed-users-by-slot";

type Props = {
	params: Promise<{ code: string }>;
};

const EditEventPage = async ({ params }: Props) => {
	const { code } = await params;
	const eventPromise = findEvent({ code: code }) as any;
	const slotsPromise = findSlots({ eventCode: code });
	const committedUsersBySlotPromise = committedUsersBySlot(code);

	return (
		<div className="flex h-full w-full flex-col items-center">
			<ManageEventWizard
				code={code}
				committedUsersBySlotPromise={committedUsersBySlotPromise}
				eventPromise={eventPromise}
				slotsPromise={slotsPromise}
				submitAction={updateEventAction}
			/>
		</div>
	);
};

export default EditEventPage;
