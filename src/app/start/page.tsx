import ManageEventWizard from "@/components/manage-event-wizard";
import { createEventAction, loginAction } from "@/app/start/submit-actions";
import { PlanEventFormData } from "@/app/start/submit-actions.schema";
import { auth } from "@/auth";
import { DEV } from "@/utilities/current-env";
import { Suspense } from "react";
import { PlanEventFormFallback } from "@/components/plan-event-form";

type Props = {
	searchParams: Promise<{ [key: string]: string }>;
};

const StartPage = async ({ searchParams }: Props) => {
	const session = await auth();
	const loggedIn = Boolean(session?.user?.id);

	const submitAction = loggedIn ? createEventAction : loginAction;

	const params = await searchParams;
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
			<Suspense fallback={<PlanEventFormFallback />}>
				<ManageEventWizard
					code={code}
					committedUsersBySlotPromise={Promise.resolve(new Map())}
					eventDataPromise={Promise.resolve([values])}
					loggedIn={loggedIn}
					slotsPromise={Promise.resolve([])}
					submitAction={submitAction}
				/>
			</Suspense>
		</main>
	);
};

export default StartPage;
