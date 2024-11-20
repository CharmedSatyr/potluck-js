import Link from "next/link";
import GotoEventForm from "@/components/goto-event-form";
import siteMetadata from "@/data/site-metadata";
import Image from "next/image";

const Home = () => {
	return (
		<main>
			<div className="hero min-h-full bg-base-200">
				<div className="hero-content mb-16 flex-col lg:flex-row-reverse">
					<Image
						alt="Potluck Quest logo"
						className="max-w-sm rounded-lg shadow-2xl"
						src="/static/potluck-quest.png"
						height="500"
						width="500"
					/>
					<div className="px-4">
						<h1 className="text-5xl mt-8 font-bold leading-normal">Gather your party, and roll for dinner!</h1>
						<p>
							<span className="text-primary">Potluck Quest</span> makes it easy for you and your friends to plan
							shared meals. In development by and for tabletop gamers who enjoy cooking and eating with their friends.
						</p>

						<div className="mt-12 flex min-h-60 w-full justify-center">
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
					</div>
				</div>
			</div>
		</main>
	);
};

export default Home;
