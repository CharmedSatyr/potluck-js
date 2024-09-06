import Link from "next/link";
import findEventByShortId from "@/actions/db/find-event-by-shortid";
import { Event } from "@/db/schema/event";
import GotoEventForm from "@/components/goto-event-form";
import siteMetadata from "@/data/site-metadata";
import CreateEventButton from "@/components/create-event-button";

const findEvent = async (shortId: Event["shortId"]): Promise<boolean> => {
	"use server";

	const event = await findEventByShortId(shortId);

	return event.length > 0;
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
					<GotoEventForm findEventAction={findEvent} />
				</div>
			</div>
		</main>
	);
};

export default Home;
