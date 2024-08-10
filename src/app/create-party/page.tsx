import createParty, { NewParty } from "@/actions/db/create-party";
import PartyForm from "@/app/create-party/party-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const createPartyAndRedirect = async (data: NewParty): Promise<void> => {
	"use server";

	const shortId = await createParty(data);

	// This is not quite right. Don't want a 303/307 code.
	redirect(`/party/${shortId}`);
};

const CreatePartyPage = async () => {
	const session = await auth();

	return (
		<>
			<h1>Start a Party</h1>
			<PartyForm
				handleCreateParty={createPartyAndRedirect}
				username={session?.user?.name ?? "Discord user"}
			/>
		</>
	);
};

export default CreatePartyPage;
