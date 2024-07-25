import createParty from "@/actions/create-party";
import PartyForm, { FormInput } from "@/app/create-party/PartyForm";
import { redirect } from "next/navigation";

const createPartyAndRedirect = async (data: FormInput) => {
	"use server";

	const shortId = await createParty(data);

	redirect(`/party/${shortId}`);
};

const CreatePartyPage = async () => {
	return <PartyForm action={createPartyAndRedirect} />;
};

export default CreatePartyPage;
