import { Suspense } from "react";
import { auth } from "@/auth";
import ManageEventWizard from "@/components/manage-event-wizard";
import { PlanEventFormFallback } from "@/components/plan-event-form";
import ErrorBoundary from "@/components/error-boundary";
import {
	buildEventDataFromParams,
	buildSlotDataFromParams,
} from "@/utilities/build-data-from-params";
import genPageMetadata from "@/seo";

export const metadata = genPageMetadata({ title: "Plan" });

type Props = {
	searchParams: Promise<{ [key: string]: string }>;
};

const PlanPage = async ({ searchParams }: Props) => {
	const session = await auth();
	const loggedIn = Boolean(session?.user?.id);

	return (
		<main className="flex h-full w-full flex-col items-center">
			<ErrorBoundary>
				<Suspense fallback={<PlanEventFormFallback />}>
					<ManageEventWizard
						code={null}
						committedUsersBySlotPromise={Promise.resolve(new Map())}
						eventDataPromise={buildEventDataFromParams(searchParams)}
						loggedIn={loggedIn}
						mode="create"
						slotsPromise={buildSlotDataFromParams(searchParams)}
					/>
				</Suspense>
			</ErrorBoundary>
		</main>
	);
};

export default PlanPage;
