import Link from "next/link";
import GotoEventForm from "@/components/goto-event-form";
import siteMetadata from "@/data/site-metadata";
import Image from "next/image";

const CreateEventButton = () => (
	<Link href="/start" className="btn btn-primary text-xl">
		Create an Event
	</Link>
);

const StartCta = () => {
	return (
		<div className="w-full xl:p-10">
			<div className="flex flex-col gap-2 text-center md:hidden">
				<CreateEventButton />

				<div className="divider-base divider">OR</div>

				<GotoEventForm />
			</div>

			<div className="hidden min-h-44 w-full md:flex">
				<div className="divider divider-start divider-horizontal w-1/2">
					<CreateEventButton />
				</div>
				<div className="divider divider-horizontal">OR</div>
				<div className="divider divider-end divider-horizontal w-1/2">
					<GotoEventForm />
				</div>
			</div>
		</div>
	);
};

const Home = () => {
	return (
		<main className="-z-10 rounded-xl bg-base-300 py-10 xl:flex">
			<div className="h-full xl:h-1/2">
				<div className="hero">
					<div className="hero-content flex-col rounded-xl text-center xl:mx-10">
						<h1 className="mb-0 text-4xl font-bold leading-tight sm:text-5xl">
							Gather your party, and roll for an epic meal.
						</h1>

						<p className="mb-0">
							<span className="text-primary">{siteMetadata.title}</span> makes
							it easy for you and your friends to plan shared meals.{" "}
							<span className="text-info">In active development</span> by and
							for tabletop gamers who enjoy cooking and eating with their
							friends.
						</p>

						<div className="flex w-full justify-center xl:hidden">
							<Image
								alt={`${siteMetadata.title} logo`}
								className="max-w-sm rounded-lg shadow-2xl"
								src="/static/potluck-quest.png"
								width="250"
								height="250"
							/>
						</div>

						<StartCta />
					</div>
				</div>
			</div>

			<div className="hidden h-full w-full items-center justify-center xl:flex 2xl:justify-center">
				<div className="relative h-80 w-80 2xl:h-96 2xl:w-96">
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
