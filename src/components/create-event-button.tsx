"use client";

import useCreateEventSession from "@/hooks/use-create-event-session-storage";

const CreateEventButton = () => {
	const [, , removeValue] = useCreateEventSession();

	return (
		<button
			onClick={() => {
				removeValue();
			}}
		>
			Create an Event
		</button>
	);
};

export default CreateEventButton;
