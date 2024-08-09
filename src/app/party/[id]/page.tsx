import { redirect } from "next/navigation";
import findPartyByShortId from "@/actions/find-party-by-shortid";
import findDishesByShortId from "@/actions/find-dishes-by-shortid";
import DishManager from "@/app/party/[id]/dish-manager";

interface Props {
	params: {
		id: string;
	};
}

const PartyPage = async ({ params }: Props) => {
	const partyData = await findPartyByShortId(params.id);

	if (!partyData.length) {
		redirect("/create-party");
	}

	const party = partyData[0];
	const dishes = await findDishesByShortId(params.id);

	return (
		<div>
			<h1>Hi</h1>
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

			<DishManager dishes={dishes} />
		</div>
	);
};

export default PartyPage;
