import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import createDish from "@/actions/create-dish";
import findPartyWithDishes from "@/actions/find-party-with-dishes";
import DishForm, { FormInput } from "@/app/party/[id]/DishForm";

interface Props {
	params: {
		id: string;
	};
}

const createDishAndRefresh = async (data: FormInput): Promise<void> => {
	"use server";

	await createDish(data);

	revalidatePath(`/party/${data.shortId}`, "page");
};

const PartyPage = async ({ params }: Props) => {
	const data = await findPartyWithDishes(params.id);

	if (!data.length) {
		redirect("/create-party");
	}

	return (
		<>
			<div>I am the party page for party {params.id}</div>
			<br />
			<div>I have so much info! Check it out:</div>
			<div>{JSON.stringify(data, null, 2)}</div>

			<br />
			<h2>Sign up to bring a dish!</h2>
			<DishForm action={createDishAndRefresh} />
		</>
	);
};

export default PartyPage;
