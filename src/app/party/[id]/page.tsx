import findPartyWithDishes from "@/actions/find-party-with-dishes";

interface Props {
	params: {
		id: string;
	};
}

const PartyPage = async ({ params }: Props) => {
	const data = await findPartyWithDishes(params.id);

	return (
		<>
			<div>I am the party page for party {params.id}</div>
			<br />
			<div>I have so much info! Check it out:</div>
			<div>{JSON.stringify(data, null, 2)}</div>
		</>
	);
};

export default PartyPage;
