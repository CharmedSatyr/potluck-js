import PlanFoodManager from "@/app/start/plan-food/plan-food-manager";

const PlanFoodPage = async () => {
	return (
		<div className="flex w-full flex-col items-center justify-items-center">
			<PlanFoodManager />

			<ul className="steps w-full">
				<li className="step step-secondary">Create an Event</li>
				<li className="step step-secondary">Plan the Food</li>
			</ul>
		</div>
	);
};

export default PlanFoodPage;
