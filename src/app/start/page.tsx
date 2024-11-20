import ManageEventWizard from "@/components/manage-event-wizard";
import { createEventAction, loginAction } from "@/app/start/submit-actions";
import { PlanEventFormData } from "@/app/start/submit-actions.schema";
import { auth } from "@/auth";
import { DEV } from "@/utilities/current-env";

type Props = {
	searchParams: Promise<{ [key: string]: string }>;
};

const StartPage = async ({ searchParams }: Props) => {
	const session = await auth();

	const submitAction = session?.user?.id ? createEventAction : loginAction;

	const params = await searchParams; // NOSONAR
	const { code, source } = params;

	const values: PlanEventFormData = {
		description: "",
		hosts: "",
		location: DEV ? "123 Main Street" : "",
		name: DEV ? "Test Event" : "",
		startDate: DEV ? "2025-01-09" : "",
		startTime: DEV ? "12:00" : "",
	};

	if (source === "discord") {
		for (const key in values) {
			const searchValue = params[key];
			if (!searchValue) {
				continue;
			}
			values[key as keyof PlanEventFormData] = searchValue;
		}
	}

	return (
		<main className="flex h-full w-full flex-col items-center">
			<ManageEventWizard
				code={code}
				committedUsersBySlotPromise={Promise.resolve(new Map())}
				eventDataPromise={Promise.resolve([values])}
				slotsPromise={Promise.resolve([])}
				submitAction={submitAction}
			/>
		</main>
	);
};

export default StartPage;
