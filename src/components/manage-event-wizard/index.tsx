"use client";

import PlanEventForm from "@/components/plan-event-form";
import PlanFoodForm from "@/components/plan-food-form";
import useAnchor from "@/hooks/use-anchor";
import {
	CreateEventFormData,
	CreateEventFormState,
} from "@/app/start/submit-actions.types";

type Props = {
	eventData: CreateEventFormData;
	submitAction: (
		prevState: CreateEventFormState,
		formData: FormData
	) => Promise<CreateEventFormState>;
};

const ManageEventWizard = ({ eventData, submitAction }: Props) => {
	const [anchor, scrollToAnchor] = useAnchor();

	return (
		<>
			<div className="carousel w-full">
				<div
					className="carousel-item flex w-full justify-center"
					id="create-event"
				>
					<PlanEventForm eventData={eventData} submitAction={submitAction} />
				</div>
				<div
					className="carousel-item flex w-full justify-center"
					id="plan-food"
				>
					<PlanFoodForm />
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
