"use client";

import { Suspense, use, useEffect, useState } from "react";
import PlanEventForm, {
	PlanEventFormFallback,
} from "@/components/plan-event-form";
import PlanFoodForm, {
	PlanFoodFormFallback,
} from "@/components/plan-food-form";
import Suggestions from "@/components/suggestions";
import useAnchor, { scrollToAnchor } from "@/hooks/use-anchor";
import { EventData } from "@/@types/event";
import { SlotData } from "@/@types/slot";
import { WizardMode } from "@/@types/wizard-mode";

type Props = {
	code: string | null;
	committedUsersBySlotPromise: Promise<Map<string, React.JSX.Element>>;
	eventDataPromise: Promise<EventData[]>;
	loggedIn: boolean;
	mode: WizardMode;
	slotsPromise: Promise<SlotData[]>;
};

export enum Step {
	CREATE_EVENT = "create-event",
	PLAN_FOOD = "plan-food",
}

const ProgressIndicator = () => {
	const [anchor = Step.CREATE_EVENT, scrollToAnchor] = useAnchor();

	useEffect(() => {
		if (anchor === Step.CREATE_EVENT) {
			scrollToAnchor(Step.CREATE_EVENT);
		}

		if (anchor === Step.PLAN_FOOD) {
			scrollToAnchor(Step.PLAN_FOOD);
		}
	}, [anchor, scrollToAnchor]);

	/* TODO: Add a hover state to make it clearer you can click. */
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
	loggedIn,
	mode,
	slotsPromise,
}: Props) => {
	const [eventData] = use(eventDataPromise);
	const slots = use(slotsPromise);

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
					<Suspense fallback={<PlanEventFormFallback />}>
						<PlanEventForm
							code={code}
							eventData={eventData}
							loggedIn={loggedIn}
							mode={mode}
						/>
					</Suspense>
				</div>

				<div
					className="carousel-item flex w-full flex-col items-center justify-center"
					id={Step.PLAN_FOOD}
				>
					<h1 className="text-primary">Plan the Food</h1>

					<Suspense>
						{loggedIn &&
						eventData.title &&
						eventData.startDate &&
						eventData.startTime &&
						eventData.location ? (
							<Suggestions
								eventData={eventData}
								populate={populateSuggestedSlots}
							/>
						) : (
							<div>
								<button
									className="link"
									onClick={() => scrollToAnchor(Step.CREATE_EVENT)}
								>
									Create an Event
								</button>{" "}
								to continue.
							</div>
						)}
					</Suspense>

					<Suspense fallback={<PlanFoodFormFallback />}>
						<PlanFoodForm
							code={code}
							committedUsersBySlotPromise={committedUsersBySlotPromise}
							eventData={eventData}
							mode={mode}
							slots={slots}
							suggestedSlots={suggestedSlots}
						/>
					</Suspense>
				</div>
			</div>

			<ProgressIndicator />
		</>
	);
};

export default ManageEventWizard;
