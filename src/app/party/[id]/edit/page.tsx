import findPartyByShortId from "@/actions/db/find-party-by-shortid";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import EditEventManager from "./edit-event-manager";

interface Props {
	params: {
		id: string;
	};
}

const EditEventPage = async ({ params }: Props) => {
	const session = await auth();

	const partyData = await findPartyByShortId(params.id);

	if (!partyData.length) {
		return <div>Event not found</div>;
	}
	const party = partyData[0];

	return (
		<SessionProvider session={session}>
			<EditEventManager {...party} />
		</SessionProvider>
	);
};

export default EditEventPage;
