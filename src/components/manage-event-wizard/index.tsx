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

			<div className="flex w-full justify-center gap-2 py-2">
				<button type="button" onClick={() => scrollToAnchor("create-event")} className="btn btn-xs">
					Create Event
				</button>
				<button type="button" onClick={() => scrollToAnchor('plan-food')} className="btn btn-xs">
					Plan Food
				</button>
			</div>

			<ul className="steps w-full">
				<li className="step step-secondary">Create an Event</li>
				<li
					className={`step ${anchor === "plan-food" ? "step-secondary" : ""}`}
				>
					Plan the Food
				</li>
			</ul>
		</div>
	);
};

export default ManageEventWizard;
