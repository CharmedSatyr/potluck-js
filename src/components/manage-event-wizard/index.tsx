"use client";

import CreateEventForm from "@/components/create-event-form";
import PlanFoodForm from "@/components/plan-food-form";
import useAnchor from "@/hooks/use-anchor";

const ManageEventWizard = () => {
	const [anchor, scrollToAnchor] = useAnchor();

	return (
		<div>
			<div className="carousel w-full">
				<div
					className="carousel-item flex w-full justify-center"
					id="create-event"
				>
					<CreateEventForm />
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
		</div>
	);
};

export default ManageEventWizard;
