import { CommitmentsTableFallback } from "@/components/commitments-table";
import { EventSkeletonFallback } from "@/components/event-skeleton/event-skeleton";
import { PlanFoodFormFallback } from "@/components/plan-food-form";
import { RsvpFormFallback } from "@/components/rsvp-form";
import { RsvpTableFallback } from "@/components/rsvp-table";
import { SlotManagerFallback } from "@/components/slot-manager";

const Loading = () => (
	<div className="flex h-full w-full flex-col flex-wrap gap-12">
		<div className="flex w-full flex-col justify-between md:flex-row">
			<div className="w-full md:w-2/3">
				<EventSkeletonFallback />
			</div>
			<RsvpFormFallback />
		</div>
		<SlotManagerFallback />
		<RsvpTableFallback />
	</div>
);

export default Loading;
