"use client";

import useCreatePartySession from "@/hooks/use-create-party-session-storage";

const CreatePartyButton = () => {
	const [, , removeValue] = useCreatePartySession();

	return (
		<button
			onClick={() => {
				removeValue();
			}}
		>
			Start a Party
		</button>
	);
};

export default CreatePartyButton;
