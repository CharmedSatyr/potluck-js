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

			<div className="flex w-full">
				<div className="card grid flex-grow place-items-center rounded-box bg-base-200">
					<Link href="/create-party" className="btn btn-primary text-2xl">
						Start a Party
					</Link>
				</div>
				<div className="divider divider-horizontal">OR</div>
				<div className="card grid flex-grow place-items-center rounded-box bg-base-200 py-8">
					<GotoPartyForm findPartyAction={findParty} />
				</div>
			</div>
		</main>
	);
};

export default Home;
