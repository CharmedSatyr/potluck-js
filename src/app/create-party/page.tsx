import createParty, { NewParty } from "@/actions/create-party";
import PartyForm from "@/app/create-party/PartyForm";
import { redirect } from "next/navigation";

const createPartyAndRedirect = async (data: NewParty): Promise<void> => {
	"use server";

	const shortId = await createParty(data);

	redirect(`/party/${shortId}`);
};

const CreatePartyPage = async () => {
	return <PartyForm action={createPartyAndRedirect} />;
};

export default CreatePartyPage;
