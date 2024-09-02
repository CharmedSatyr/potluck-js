import CreateEventManager from "@/app/start/create-event/create-event-manager";

const CreateEventPage = async () => {
	return (
		<div className="flex w-full flex-col items-center justify-items-center">
			<CreateEventManager />

			<ul className="steps w-full">
				<li className="step step-secondary">Create an Event</li>
				<li className="step">Plan the Food</li>
			</ul>
		</div>
	);
};

export default CreateEventPage;
