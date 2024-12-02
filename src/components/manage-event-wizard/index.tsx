"use client";

import { Suspense, use, useEffect, useState } from "react";
import PlanEventForm from "@/components/plan-event-form";
import PlanFoodForm from "@/components/plan-food-form";
import Suggestions from "@/components/suggestions";
import useAnchor from "@/hooks/use-anchor";
import { EventData } from "@/@types/event";
import { SlotData } from "@/@types/slot";
import { WizardMode } from "@/@types/wizard-mode";

type Props = {
	code: string | null;
	committedUsersBySlotPromise: Promise<Map<string, JSX.Element>>;
	eventDataPromise: Promise<EventData[]>;
	mode: WizardMode;
	slotsPromise: Promise<SlotData[]>;
};

export enum Step {
	CREATE_EVENT = "create-event",
	PLAN_FOOD = "plan-food",
}

const ProgressIndicator = () => {
	const [anchor, scrollToAnchor] = useAnchor();

	useEffect(() => {
		if (!anchor) {
			scrollToAnchor(Step.CREATE_EVENT);
		}
	}, [anchor]);

	/* Add a hover state to make it clearer you can click. */
	return (
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
	);
};

const ManageEventWizard = ({
	code,
	committedUsersBySlotPromise,
	eventDataPromise,
	mode,
	slotsPromise,
}: Props) => {
	const [eventData] = use(eventDataPromise);
	const slots = use(slotsPromise);
	const committedUsersBySlot = use(committedUsersBySlotPromise);

	const [suggestedSlots, setSuggestedSlots] = useState<SlotData[]>([]);

	const populateSuggestedSlots = (items: SlotData[]) => {
		setSuggestedSlots(items);
	};

	return (
		<>
			<div className="carousel w-full">
				<div
					className="carousel-item flex w-full justify-center"
					id={Step.CREATE_EVENT}
				>
					<PlanEventForm code={code} eventData={eventData} mode={mode} />
				</div>

				<div
					className="carousel-item flex w-full flex-col items-center justify-center"
					id={Step.PLAN_FOOD}
				>
					<h1 className="text-primary">Plan the Food</h1>

					<Suspense>
						{eventData && (
							<Suggestions
								eventData={eventData}
								populate={populateSuggestedSlots}
							/>
						)}
					</Suspense>

					<PlanFoodForm
						committedUsersBySlot={committedUsersBySlot}
						eventData={eventData}
						slots={[...slots, ...suggestedSlots]}
					/>
				</div>
			</div>

			<ProgressIndicator />
		</>
	);
};

export default ManageEventWizard;
