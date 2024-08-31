import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import CreateEventManager from "@/app/start/create-event/create-event-manager";

const CreateEventPage = async () => {
	const session = await auth();

	return (
		<SessionProvider session={session}>
			<div className="flex w-full flex-col items-center justify-items-center">
				<CreateEventManager />
				<ul className="steps w-full">
					<li className="step step-secondary">Create an Event</li>
					<li className="step">Plan the Food</li>
				</ul>
			</div>
		</SessionProvider>
	);
};

export default CreateEventPage;
