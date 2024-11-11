"use client";

import PlanEventForm from "@/components/plan-event-form";
import PlanFoodForm from "@/components/plan-food-form";
import useAnchor from "@/hooks/use-anchor";
import {
	PlanEventFormData,
	PlanEventFormState,
} from "@/app/start/submit-actions.types";
import { Suspense, use } from "react";

type Props = {
	code: string | null;
	eventPromise: Promise<PlanEventFormData[]>;
	submitAction: (
		prevState: PlanEventFormState,
		formData: FormData
	) => Promise<PlanEventFormState>;
};

const ManageEventWizard = ({ code, eventPromise, submitAction }: Props) => {
	const [anchor, scrollToAnchor] = useAnchor();
	const [eventData] = use(eventPromise);

	return (
		<>
			<div className="carousel w-full">
				<div
					className="carousel-item flex w-full justify-center"
					id="create-event"
				>
					<Suspense fallback="TODO: Skellington">
						<PlanEventForm
							code={code}
							eventData={eventData}
							submitAction={submitAction}
						/>
					</Suspense>
				</div>
				<div
					className="carousel-item flex w-full justify-center"
					id="plan-food"
				>
					<PlanFoodForm code={code} />
				</div>
			</div>

			{/* Add a hover state to make it clearer you can click. */}
			<div className="steps my-8 w-full">
				<button
					className="step step-secondary"
					onClick={() => scrollToAnchor("create-event")}
				>
					Create an Event
				</button>
				<button
					className={`step ${anchor === "plan-food" ? "step-secondary" : ""}`}
					onClick={() => scrollToAnchor("plan-food")}
				>
					Plan the Food
				</button>
			</div>
		</>
	);
};

export default ManageEventWizard;
