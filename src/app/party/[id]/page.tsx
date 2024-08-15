import { redirect } from "next/navigation";
import findPartyByShortId from "@/actions/db/find-party-by-shortid";
import findDishesByShortId from "@/actions/db/find-dishes-by-shortid";
import DishManager from "@/app/party/[id]/dish-manager";
import { auth } from "@/auth";

interface Props {
	params: {
		id: string;
	};
}

const PartyPage = async ({ params }: Props) => {
	const session = await auth();
	const loggedIn = Boolean(session?.user);

	const partyData = await findPartyByShortId(params.id);

	if (!partyData.length) {
		redirect("/create-party");
	}

	const party = partyData[0];
	const dishes = await findDishesByShortId(params.id);

	const options: Intl.DateTimeFormatOptions = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	};

	const formatStartTime = (startTime: string) => {
		const time = startTime.split(":");
		const hours = parseInt(time[0]);
		const minutes = time[1].padStart(2, "0");

		if (hours > 12) {
			return `${hours - 12}:${minutes} PM`;
		}

		return `${hours}:${minutes} AM`;
	};

	return (
		<div>
			<h1>
				Party Code: <span className="text-secondary">{party.shortId}</span>
			</h1>
			<h1 className="text-primary">{party.name}</h1>
			<h2 className="mt-0">{party.location}</h2>
			<h2 className="mt-0 font-normal text-neutral">
				<time className="font-bold" dateTime={party.startDate}>
					{new Date(party.startDate).toLocaleDateString("en-US", options)}
				</time>{" "}
				at{" "}
				<time className="font-bold" dateTime={party.startTime}>
					{formatStartTime(party.startTime)}
				</time>
			</h2>
			<h3>Hosted by {party.hosts}</h3>
			<div>{party.description}</div>

			<DishManager
				dishes={dishes}
				loggedIn={loggedIn}
				username={session?.user?.name ?? "Discord user"}
			/>
		</div>
	);
};

export default PartyPage;
