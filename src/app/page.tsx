import Link from "next/link";
import GotoEventForm from "@/components/goto-event-form";
import siteMetadata from "@/data/site-metadata";

const Home = () => {
	return (
		<main>
			<h1 className="mb-2">{siteMetadata.title}</h1>
			<h2 className="mt-0 text-secondary">a potluck planning app</h2>

			<div className="mt-20 flex min-h-60 w-full justify-center">
				<div className="divider divider-start divider-horizontal w-fit">
					<Link href="/start" className="btn btn-primary text-2xl">
						<button type="button">Create an Event</button>
					</Link>
				</div>
				<div className="divider divider-horizontal">OR</div>
				<div className="divider divider-end divider-horizontal w-fit">
					<GotoEventForm />
				</div>
			</div>
		</main>
	);
};

export default Home;
