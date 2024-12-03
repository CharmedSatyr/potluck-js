import { CommitmentsTableFallback } from "@/components/commitments-table";
import { EventSkeletonFallback } from "@/components/event-skeleton";
import { RsvpFormFallback } from "@/components/rsvp-form";
import { RsvpTableFallback } from "@/components/rsvp-table";

const Loading = () => (
	<div className="flex h-full w-full flex-col flex-wrap gap-6 md:gap-12">
		<div className="flex flex-col md:flex-row">
			<EventSkeletonFallback />
			<RsvpFormFallback />
		</div>
		<CommitmentsTableFallback />
		<RsvpTableFallback />
	</div>
);

export default Loading;
