import ManageEventWizard from "@/components/manage-event-wizard";
import { auth } from "@/auth";
import { DEV } from "@/utilities/current-env";
import { Suspense } from "react";
import { PlanEventFormFallback } from "@/components/plan-event-form";
import ErrorBoundary from "@/components/error-boundary";
import { EventData } from "@/@types/event";

type Props = {
	searchParams: Promise<{ [key: string]: string }>;
};

const StartPage = async ({ searchParams }: Props) => {
	const session = await auth();
	const loggedIn = Boolean(session?.user?.id);

	const params = await searchParams;
	const { code } = params;

	const values: EventData = {
		description: "",
		hosts: "",
		location: DEV ? "123 Main Street" : "",
		name: DEV ? "Test Event" : "",
		startDate: DEV ? "2025-01-09" : "",
		startTime: DEV ? "12:00" : "",
	};

	for (const key in values) {
		const searchValue = params[key];
		if (!searchValue) {
			continue;
		}
		values[key as keyof EventData] = searchValue;
	}

	return (
		<main className="flex h-full w-full flex-col items-center">
			<ErrorBoundary>
				<Suspense fallback={<PlanEventFormFallback />}>
					<ManageEventWizard
						code={code}
						committedUsersBySlotPromise={Promise.resolve(new Map())}
						eventDataPromise={Promise.resolve([values])}
						loggedIn={loggedIn}
						mode="create"
						slotsPromise={Promise.resolve([])}
					/>
				</Suspense>
			</ErrorBoundary>
		</main>
	);
};

export default StartPage;
