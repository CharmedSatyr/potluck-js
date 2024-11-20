import Link from "next/link";
import GotoEventForm from "@/components/goto-event-form";
import siteMetadata from "@/data/site-metadata";
import Image from "next/image";

const Home = () => {
	return (
		<main>
			<div className="hero min-h-full bg-base-300 py-16 px-24">
				<div className="hero-content flex-col lg:flex-row-reverse justify-between">
					<div className="w-1/2 flex justify-end">
						<Image
							alt="Potluck Quest logo"
							className="max-w-sm rounded-lg shadow-2xl"
							src="/static/potluck-quest.png"
							height="500"
							width="500"
						/>
					</div>
					<div className="w-1/2 flex flex-col justify-around">
						<h1 className="text-5xl mb-0 font-bold leading-normal">Gather your party, and roll for dinner!</h1>
						<p>
							<span className="text-primary">Potluck Quest</span> makes it easy for you and your friends to plan
							shared meals. <span className="text-info">In active development</span> by and for tabletop gamers who enjoy cooking and eating with their friends.
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
		</main >
	);
};

export default Home;
