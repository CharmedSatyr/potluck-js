import { Suspense } from "react";
import PlanFoodManager from "@/app/start/[id]/plan-food/plan-food-manager";
import LoadingIndicator from "@/components/loading-indicator";

type Props = {
	params: {
		id: string;
	};
};

const PlanFoodPage = async ({ params }: Props) => {
	return (
		<div className="flex w-full flex-col items-center justify-items-center">
			<Suspense fallback={<LoadingIndicator />}>
				<PlanFoodManager code={params.id} />
			</Suspense>

			<ul className="steps w-full">
				<li className="step step-secondary">Create an Event</li>
				<li className="step step-secondary">Plan the Food</li>
			</ul>
		</div>
	);
};

export default PlanFoodPage;
