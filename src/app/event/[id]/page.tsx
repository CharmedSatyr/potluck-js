import findFoodPlan from "@/actions/db/find-food-plan";
import findPartyByShortId from "@/actions/db/find-party-by-shortid";
import findCommitments from "@/actions/db/find-commitments";
import RequestManager from "@/app/event/[id]/request-manager";
import EventSkeleton from "@/components/event-skeleton";

interface Props {
	params: {
		id: string;
	};
}

const PartyPage = async ({ params }: Props) => {
	const partyData = (await findPartyByShortId(params.id)) ?? [];
	const requests = (await findFoodPlan({ shortId: params.id })) ?? []; // TODO: Make consistent

	if (!partyData.length) {
		return <div>Event not found</div>;
	}

	const party = partyData[0];

	const commitments = await findCommitments(party.id);

	return (
		<div className="flex w-full flex-col justify-center">
			<EventSkeleton {...party} />
			<RequestManager commitments={commitments} requests={requests} />
		</div>
	);
};

export default PartyPage;
