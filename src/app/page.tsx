import Link from "next/link";
import findPartyByShortId from "@/actions/db/find-party-by-shortid";
import { Party } from "@/db/schema/parties";
import GotoPartyForm from "@/components/goto-party-form";
import siteMetadata from "@/data/site-metadata";
import CreateEventButton from "@/components/create-event-button";

const findParty = async (shortId: Party["shortId"]): Promise<boolean> => {
	"use server";

	const party = await findPartyByShortId(shortId);

	return party.length > 0;
};

const Home = () => {
	return (
		<main>
			<h1 className="mb-2">{siteMetadata.title}</h1>
			<h2 className="mt-0 text-secondary">a potluck planning app</h2>

			<div className="mt-20 flex min-h-60 w-full justify-center">
				<div className="divider divider-start divider-horizontal w-fit">
					<Link href="/start" className="btn btn-primary text-2xl">
						<CreateEventButton />
					</Link>
				</div>
				<div className="divider divider-horizontal">OR</div>
				<div className="divider divider-end divider-horizontal w-fit">
					<GotoPartyForm findPartyAction={findParty} />
				</div>
			</div>
		</main>
	);
};

export default Home;
