import ManageEventWizard from "@/components/manage-event-wizard";
import { createEventAction, loginAction } from "@/app/start/submit-actions";
import { PlanEventFormData } from "@/app/start/submit-actions.schema";
import { auth } from "@/auth";

const DEV = process.env.NODE_ENV === "development";

const StartPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string };
}) => {
	const session = await auth();

	const submitAction = session?.user?.id ? createEventAction : loginAction;

	const params = await searchParams; // NOSONAR
	const code = params.code;
	const values: PlanEventFormData = {
		description: "",
		hosts: "",
		location: DEV ? "123 Main Street" : "",
		name: DEV ? "Test Event" : "",
		startDate: DEV ? "2025-01-09" : "",
		startTime: DEV ? "12:00" : "",
	};

	if (params.source === "discord") {
		for (const key in values) {
			const searchValue = params[key];
			if (!searchValue) {
				continue;
			}
			values[key as keyof PlanEventFormData] = searchValue;
		}
	}

	return (
		<div className="flex h-full w-full flex-col items-center">
			<ManageEventWizard
				code={code}
				committedUsersBySlotPromise={Promise.resolve(new Map())}
				eventDataPromise={Promise.resolve([values])}
				slotsPromise={Promise.resolve([])}
				submitAction={submitAction}
			/>
		</div>
	);
};

export default StartPage;
