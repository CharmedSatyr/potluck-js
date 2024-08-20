import findPartyByShortId from "@/actions/db/find-party-by-shortid";
import { auth } from "@/auth";
import EventSkeleton from "@/components/event-skeleton";

interface Props {
	params: {
		id: string;
	};
}

const PartyPage = async ({ params }: Props) => {
	const session = await auth();

	const partyData = await findPartyByShortId(params.id);

	if (!partyData.length) {
		return <div>Event not found</div>;
	}

	const party = partyData[0];

	const userIsHost = session?.user?.email === party.createdBy;

	return (
		<div className="flex justify-center">
			<EventSkeleton {...party} isHost={userIsHost} />
		</div>
	);
};

export default PartyPage;
