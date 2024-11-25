"use client";

import PlanEventForm from "@/components/plan-event-form";
import PlanFoodForm from "@/components/plan-food-form";
import useAnchor from "@/hooks/use-anchor";
import {
	PlanEventFormData,
	PlanEventFormState,
} from "@/app/start/submit-actions.schema";
import { Slot } from "@/db/schema/slot";
import { use } from "react";

type Props = {
	code: string | null;
	committedUsersBySlotPromise: Promise<Map<string, JSX.Element>>;
	eventDataPromise: Promise<PlanEventFormData[]>;
	loggedIn: boolean;
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
	loggedIn,
	slotsPromise,
	submitAction,
}: Props) => {
	const [anchor, scrollToAnchor] = useAnchor();
	const [eventData] = use(eventDataPromise);
	const slots = use(slotsPromise);
	const committedUsersBySlot = use(committedUsersBySlotPromise);

	return (
		<>
			<div className="carousel w-full">
				<div
					className="carousel-item flex w-full justify-center"
					id="create-event"
				>
					<PlanEventForm
						code={code}
						eventData={eventData}
						loggedIn={loggedIn}
						submitAction={submitAction}
					/>
				</div>

				<div
					className="carousel-item flex w-full justify-center"
					id="plan-food"
				>
					<PlanFoodForm
						code={code}
						slots={slots}
						committedUsersBySlot={committedUsersBySlot}
					/>
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
