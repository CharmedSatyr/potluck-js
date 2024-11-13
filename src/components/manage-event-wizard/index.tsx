"use client";

import PlanEventForm from "@/components/plan-event-form";
import PlanFoodForm from "@/components/plan-food-form";
import useAnchor from "@/hooks/use-anchor";
import {
	PlanEventFormData,
	PlanEventFormState,
} from "@/app/start/submit-actions.schema";
import { Slot } from "@/db/schema/slot";
import { Suspense } from "react";

type Props = {
	code: string | null;
	committedUsersBySlotPromise: Promise<Map<string, JSX.Element>>;
	eventDataPromise: Promise<PlanEventFormData[]>;
	slotsPromise: Promise<Slot[]>;
	submitAction: (
		prevState: PlanEventFormState,
		formData: FormData
	) => Promise<PlanEventFormState>;
};

const ManageEventWizard = ({
	code,
	committedUsersBySlotPromise,
	eventDataPromise,
	slotsPromise,
	submitAction,
}: Props) => {
	const [anchor, scrollToAnchor] = useAnchor();

	return (
		<>
			<div className="carousel w-full">
				<div
					className="carousel-item flex w-full justify-center"
					id="create-event"
				>
					<Suspense>
						<PlanEventForm
							code={code}
							eventDataPromise={eventDataPromise}
							submitAction={submitAction}
						/>
					</Suspense>
				</div>

				<div
					className="carousel-item flex w-full justify-center"
					id="plan-food"
				>
					<Suspense>
						<PlanFoodForm
							code={code}
							slotsPromise={slotsPromise}
							committedUsersBySlotPromise={committedUsersBySlotPromise}
						/>
					</Suspense>
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
