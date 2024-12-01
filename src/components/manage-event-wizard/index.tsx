"use client";

import PlanEventForm from "@/components/plan-event-form";
import PlanFoodForm from "@/components/plan-food-form";
import useAnchor from "@/hooks/use-anchor";
import {
	PlanEventFormData,
	PlanEventFormState,
} from "@/app/plan/submit-actions.schema";
import { Slot } from "@/db/schema/slot";
import { Suspense, use, useEffect, useState } from "react";
import Suggestions from "@/components/suggestions";
import { useSearchParams } from "next/navigation";

type Props = {
	code: string | null;
	committedUsersBySlotPromise: Promise<Map<string, JSX.Element>>;
	eventDataPromise: Promise<PlanEventFormData[]>;
	loggedIn: boolean;
	mode: "create" | "edit";
	slotsPromise: Promise<Slot[]>;
	submitAction: (
		prevState: PlanEventFormState,
		formData: FormData
	) => Promise<PlanEventFormState>;
};

export enum Step {
	CREATE_EVENT = "create-event",
	PLAN_FOOD = "plan-food",
}

const ManageEventWizard = ({
	code,
	committedUsersBySlotPromise,
	eventDataPromise,
	loggedIn,
	mode,
	slotsPromise,
	submitAction,
}: Props) => {
	const [anchor, scrollToAnchor] = useAnchor();
	const [eventData] = use(eventDataPromise);
	const slots = use(slotsPromise);
	const committedUsersBySlot = use(committedUsersBySlotPromise);
	const params = useSearchParams();

	const [suggestedSlots, setSuggestedSlots] = useState<
		{ count: number; id: string; item: string }[]
	>([]);

	code = code ?? params.get("code");

	const populate = (items: { count: number; id: string; item: string }[]) => {
		setSuggestedSlots(items);
	};

	return (
		<>
			<div className="carousel w-full">
				<div
					className="carousel-item flex w-full justify-center"
					id={Step.CREATE_EVENT}
				>
					<PlanEventForm
						code={code}
						eventData={eventData}
						loggedIn={loggedIn}
						mode={mode}
						submitAction={submitAction}
					/>
				</div>

				<div
					className="carousel-item flex w-full flex-col items-center justify-center"
					id={Step.PLAN_FOOD}
				>
					<h1 className="text-primary">Plan the Food</h1>

					<Suspense>
						{code && <Suggestions code={code} populate={populate} />}
					</Suspense>

					<PlanFoodForm
						code={code}
						// TODO: Fix db schema
						slots={[
							...slots.map((slot) => ({ ...slot, item: slot.course })),
							...suggestedSlots,
						]}
						committedUsersBySlot={committedUsersBySlot}
					/>
				</div>
			</div>

			{/* Add a hover state to make it clearer you can click. */}
			<div className="steps my-8 w-full">
				<button
					className="step step-secondary"
					onClick={() => scrollToAnchor(Step.CREATE_EVENT)}
				>
					Create an Event
				</button>
				<button
					className={`step ${anchor === Step.PLAN_FOOD ? "step-secondary" : ""}`}
					onClick={() => scrollToAnchor(Step.PLAN_FOOD)}
				>
					Plan the Food
				</button>
			</div>
		</>
	);
};

export default ManageEventWizard;
