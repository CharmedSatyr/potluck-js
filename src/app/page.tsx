import Link from "next/link";
import findPartyByShortId from "@/actions/db/find-party-by-shortid";
import { Party } from "@/db/schema/parties";
import GotoPartyForm from "@/components/goto-party-form";

const findParty = async (shortId: Party["shortId"]): Promise<boolean> => {
	"use server";

	const party = await findPartyByShortId(shortId);

	return party.length > 0;
};

const Home = () => {
	return (
		<main>
			<h1 className="mb-2">13 Potato Salads</h1>
			<h2 className="mt-0 text-secondary">a potluck planning app</h2>

			<div className="flex flex-col">
				<Link href="/create-party" className="btn btn-primary text-2xl">
					Start a Party
				</Link>

				<GotoPartyForm findPartyAction={findParty} />
			</div>
		</main>
	);
};

export default Home;
