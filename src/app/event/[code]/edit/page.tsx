import findEvent from "@/actions/db/find-event";
import ManageEventWizard from "@/components/manage-event-wizard";
import { updateEventAction } from "./submit-actions";
import findRequests from "@/actions/db/find-requests";

type Props = {
	params: Promise<{ code: string }>;
};

const EditEventPage = async ({ params }: Props) => {
	const { code } = await params;
	const eventPromise = findEvent({ code: code }) as any;
	const requestsPromise = findRequests({ eventCode: code });

	return (
		<div className="flex h-full w-full flex-col items-center">
			<ManageEventWizard
				code={code}
				eventPromise={eventPromise}
				requestsPromise={requestsPromise}
				submitAction={updateEventAction}
			/>
		</div>
	);
};

export default EditEventPage;
