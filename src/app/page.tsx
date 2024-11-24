import Link from "next/link";
import GotoEventForm from "@/components/goto-event-form";
import siteMetadata from "@/data/site-metadata";
import Image from "next/image";

const Home = () => {
	return (
		<main className="-z-10 xl:grid xl:grid-cols-2 xl:place-items-end xl:bg-base-300 xl:p-10">
			<div className="h-full">
				<div className="hero">
					<div className="hero-content flex-col rounded-lg text-center">
						<h1 className="mb-0 text-5xl font-bold leading-tight">
							Gather your party, and roll for an epic meal.
						</h1>

						<div className="flex w-full justify-center xl:hidden">
							<Image
								alt={`${siteMetadata.title} logo`}
								className="max-w-sm rounded-lg shadow-2xl"
								src="/static/potluck-quest.png"
								width="250"
								height="250"
							/>
						</div>

						<p>
							<span className="text-primary">{siteMetadata.title}</span> makes
							it easy for you and your friends to plan shared meals.{" "}
							<span className="text-info">In active development</span> by and
							for tabletop gamers who enjoy cooking and eating with their
							friends.
						</p>
					</div>
				</div>

				<div className="flex flex-col gap-2 text-center">
					<Link href="/start" className="btn btn-primary w-full text-xl">
						<button className="h-full w-full" type="button">
							Create an Event
						</button>
					</Link>
					<div className="divider-base divider">OR</div>
					<GotoEventForm />
				</div>
			</div>

			<div className="hidden xl:flex xl:h-full xl:w-full xl:items-center xl:justify-center">
				<div className="h-96 w-96 xl:relative">
					<Image
						alt={`${siteMetadata.title} logo`}
						className="m-0 rounded-lg shadow-2xl"
						src="/static/potluck-quest.png"
						fill
					/>
				</div>
			</div>
		</main>
	);
};

export default Home;
