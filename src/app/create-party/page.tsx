import { redirect } from "next/navigation";
import { NewParty } from "@/actions/db/create-party";

export type FormInput = Omit<NewParty, "createdBy">;

const CreatePartyPage = async () => {
	redirect("/create-party/step-one");
};

export default CreatePartyPage;
