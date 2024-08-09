import createParty, { NewParty } from "@/actions/create-party";
import PartyForm from "@/app/create-party/party-form";
import { redirect } from "next/navigation";

const createPartyAndRedirect = async (data: NewParty): Promise<void> => {
	"use server";

	const shortId = await createParty(data);

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
