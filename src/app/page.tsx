import Link from "next/link";
import GotoEventForm from "@/components/goto-event-form";
import siteMetadata from "@/data/site-metadata";
import Image from "next/image";

const Home = () => {
	return (
		<main>
			<div className="hero min-h-full rounded-lg bg-base-300 px-24 py-16">
				<div className="hero-content flex-col justify-between lg:flex-row-reverse">
					<div className="flex w-1/2 justify-end">
						<Image
							alt={`${siteMetadata.title} logo`}
							className="max-w-sm rounded-lg shadow-2xl"
							src="/static/potluck-quest.png"
							height="500"
							width="500"
						/>
					</div>
					<div className="flex w-1/2 flex-col justify-around">
						<h1 className="mb-0 text-5xl font-bold leading-normal">
							Gather your party, and roll for an epic meal.
						</h1>
						<p>
							<span className="text-primary">{siteMetadata.title}</span> makes it easy
							for you and your friends to plan shared meals.{" "}
							<span className="text-info">In active development</span> by and
							for tabletop gamers who enjoy cooking and eating with their
							friends.
						</p>

						<div className="flex min-h-60 w-full justify-center">
							<div className="divider divider-start divider-horizontal w-fit">
								<Link href="/start" className="btn btn-primary text-xl">
									<button type="button">Create an Event</button>
								</Link>
							</div>
							<div className="divider divider-horizontal">OR</div>
							<div className="divider divider-end divider-horizontal w-fit">
								<GotoEventForm />
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Home;
