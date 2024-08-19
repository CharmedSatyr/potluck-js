import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import CreateEventForm from "@/app/start/create-event/create-event-form";

const CreateEventPage = async () => {
	const session = await auth();

	return (
		<SessionProvider session={session}>
			<div className="flex flex-col items-center justify-items-center">
				<CreateEventForm />
				<ul className="steps w-full">
					<li className="step step-secondary">Create an Event</li>
					<li className="step">Plan the Food</li>
				</ul>
			</div>
		</SessionProvider>
	);
};

export default CreateEventPage;
