import { Suspense } from "react";
import ManageEventWizard from "@/components/manage-event-wizard";
import { PlanEventFormFallback } from "@/components/plan-event-form";
import { buildEventDataFromParams } from "@/utilities/build-data-from-params";

type Props = {
	searchParams: Promise<{ [key: string]: string }>;
};

const PlanPage = async ({ searchParams }: Props) => {
	const params = await searchParams;
	const { code } = params;

	const values = buildEventDataFromParams(params);

	return (
		<main className="flex h-full w-full flex-col items-center">
			<Suspense fallback={<PlanEventFormFallback />}>
				<ManageEventWizard
					code={code}
					committedUsersBySlotPromise={Promise.resolve(new Map())}
					eventDataPromise={Promise.resolve([values])}
					mode="create"
					slotsPromise={Promise.resolve([])}
				/>
			</Suspense>
		</main>
	);
};

export default PlanPage;
