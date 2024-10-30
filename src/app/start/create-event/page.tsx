import { Suspense } from "react";
import CreateEventManager from "@/app/start/create-event/create-event-manager";

const LoadingSkeleton = () => {
	return (
		<>
			<div className="skeleton mb-4 mt-2 h-10 w-full"></div>
			<div className="skeleton my-2 h-14 w-full"></div>
			<div className="skeleton my-2 h-8 w-full"></div>
			<div className="skeleton my-2 h-8 w-full"></div>
			<div className="skeleton my-2 h-8 w-full"></div>
			<div className="skeleton my-2 h-8 w-full"></div>
			<div className="skeleton my-4 h-14 w-full"></div>
		</>
	);
};

const CreateEventPage = async () => {
	return (
		<div className="flex w-full flex-col items-center justify-items-center">
			<Suspense fallback={<LoadingSkeleton />}>
				<CreateEventManager />
			</Suspense>

			<ul className="steps w-full">
				<li className="step step-secondary">Create an Event</li>
				<li className="step">Plan the Food</li>
			</ul>
		</div>
	);
};

export default CreateEventPage;
