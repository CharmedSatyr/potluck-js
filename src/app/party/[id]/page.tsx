import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import createDish from "@/actions/create-dish";
import findPartyByShortId from "@/actions/find-party-by-shortid";
import findDishesByShortId from "@/actions/find-dishes-by-shortid";
import DishForm, { FormInput } from "@/app/party/[id]/DishForm";

interface Props {
	params: {
		id: string;
	};
}

const createDishAndRefresh = async (data: FormInput): Promise<void> => {
	"use server";

	await createDish(data);

	// TODO: Prevent full-page re-render when submitting new dish.
	revalidatePath(`/party/${data.shortId}`, "page");
};

const PartyPage = async ({ params }: Props) => {
	const partyData = await findPartyByShortId(params.id);

	if (!partyData.length) {
		redirect("/create-party");
	}

	const party = partyData[0];
	const dishes = await findDishesByShortId(params.id);

	return (
		<>
			<div>I am the party page for party {params.id}</div>
			<br />
			<div>I have so much info! Check it out:</div>
			<br />
			<div>Created at: {party.createdAt.toDateString()}</div>
			<div>Created by: {party.createdBy}</div>
			<div>Name: {party.name}</div>
			<div>Hosts: {party.hosts}</div>
			<div>
				Time: {party.start.toDateString()} - {party.end.toDateString()}
			</div>
			<div>Description: {party.description}</div>
			<div>Updated: {party.updatedAt.toDateString()}</div>

			<br />
			<h2>Dishes</h2>
			{dishes.map((dish) => (
				<div key={`${dish.name}-${dish.createdAt}`}>
					<div>{dish.name}</div>
					<div>{dish.description}</div>
					<div>{dish.createdBy}</div>
				</div>
			))}

			<br />
			<h2>Sign up to bring a dish!</h2>
			<DishForm action={createDishAndRefresh} />
		</>
	);
};

export default PartyPage;
