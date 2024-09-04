import findFoodPlan from "@/actions/db/find-food-plan";
import findPartyByShortId from "@/actions/db/find-party-by-shortid";
import { auth } from "@/auth";
import EventSkeleton from "@/components/event-skeleton";
import FoodPlanManager from "./food-plan";

interface Props {
	params: {
		id: string;
	};
}

const PartyPage = async ({ params }: Props) => {
	const session = await auth();

	const partyData = await findPartyByShortId(params.id);
	const foodPlans = await findFoodPlan({ shortId: params.id }); // Make consistent

	if (!partyData.length) {
		return <div>Event not found</div>;
	}

	const party = partyData[0];

	const userIsHost = session?.user?.email === party.createdBy;

	return (
		<div className="flex w-full flex-col justify-center">
			<EventSkeleton {...party} isHost={userIsHost} />
			<FoodPlanManager foodPlans={foodPlans} />
		</div>
	);
};

export default PartyPage;
