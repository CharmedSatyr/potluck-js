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
			<h1>
				Party Code: <span className="text-secondary">{party.shortId}</span>
			</h1>
			<h1 className="text-primary">{party.name}</h1>
			<h2 className="mt-0">
				{party.location}
			</h2>
			<h2 className="mt-0 font-normal text-neutral">
				<time dateTime={party.start.toISOString()}>
					{party.start.toLocaleDateString()}
				</time>{" "}
				-{" "}
				<time dateTime={party.end.toISOString()}>
					{party.end.toLocaleDateString()}
				</time>
				<br />
				<span className="text-neutral">
					<time>{party.start.toLocaleTimeString()}</time> -{" "}
					<time>{party.end.toLocaleTimeString()}</time>
				</span>
			</h2>
			<h3>Hosted by {party.hosts}</h3>
			<div>{party.description}</div>

			<DishManager dishes={dishes} />
		</div>
	);
};

export default PartyPage;
