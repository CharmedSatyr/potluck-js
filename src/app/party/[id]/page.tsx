import findParty from "@/actions/find-party";
import { useEffect } from "react";

const PartyPage = async({ params }: { params: { id: string } }) => {
	const data = await findParty(params.id);

	return (
		<>
			<div>I am the party page for party {params.id}</div>
			<br /> <div>I have so much info! Check it out:</div>
			<div>{JSON.stringify(data, null, 2)}</div>
		</>
	);
};

export default PartyPage;
