import findPartyByShortId from "@/actions/db/find-party-by-shortid";
import findDishesByShortId from "@/actions/db/find-dishes-by-shortid";
import { auth } from "@/auth";
import PartyManager from "./party-manager";
import { Party } from "@/db/schema/parties";

interface Props {
	params: {
		id: string;
	};
}

const PartyPage = async ({ params }: Props) => {
	const session = await auth();

	const partyData = await findPartyByShortId(params.id);

	if (!partyData.length) {
		return <div>No such party!</div>;
	}

	const party: Party = partyData[0];
	const dishes = await findDishesByShortId(params.id);

	return (
		<div>
			<h1>
				Party Code: <span className="text-secondary">{party.shortId}</span>
			</h1>

			<PartyManager dishes={dishes} party={party} session={session} />
		</div>
	);
};

export default PartyPage;
