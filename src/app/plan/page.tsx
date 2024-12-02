import { Suspense } from "react";
import ManageEventWizard from "@/components/manage-event-wizard";
import { PlanEventFormFallback } from "@/components/plan-event-form";
import {
	buildEventDataFromParams,
	buildSlotDataFromParams,
} from "@/utilities/build-data-from-params";
import ErrorBoundary from "@/components/error-boundary";

type Props = {
	searchParams: Promise<{ [key: string]: string }>;
};

const PlanPage = async ({ searchParams }: Props) => {
	const params = await searchParams;
	const { code } = params;

	const eventData = buildEventDataFromParams(params);
	const slotData = buildSlotDataFromParams(params);

	return (
		<main className="flex h-full w-full flex-col items-center">
			<ErrorBoundary>
				<Suspense fallback={<PlanEventFormFallback />}>
					<ManageEventWizard
						code={code}
						committedUsersBySlotPromise={Promise.resolve(new Map())}
						eventDataPromise={Promise.resolve([eventData])}
						mode="create"
						slotsPromise={Promise.resolve(slotData)}
					/>
				</Suspense>
			</ErrorBoundary>
		</main>
	);
};

export default PlanPage;
