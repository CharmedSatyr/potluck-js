import createParty, { NewParty } from "@/actions/db/create-party";
import PartyForm from "@/app/create-party/party-form";
import { redirect } from "next/navigation";

const createPartyAndRedirect = async (data: NewParty): Promise<void> => {
	"use server";

	const shortId = await createParty(data);

	// This is not quite right. Don't want a 303/307 code.
	redirect(`/party/${shortId}`);
};

const CreatePartyPage = async () => {
	return (
		<>
			<h1>Start a Party</h1>
			<PartyForm handleCreateParty={createPartyAndRedirect} />
		</>
	);
};

export default CreatePartyPage;
