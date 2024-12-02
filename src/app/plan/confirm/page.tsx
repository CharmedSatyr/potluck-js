import createEvent from "@/actions/db/create-event";
import createSlots from "@/actions/db/create-slots";
import { auth } from "@/auth";
import {
	buildEventDataFromParams,
	buildSlotDataFromParams,
} from "@/utilities/build-data-from-params";
import { redirect } from "next/navigation";

type Props = {
	searchParams: Promise<{ [key: string]: string }>;
};

const Page = async ({ searchParams }: Props) => {
	const session = await auth();

	const params = await searchParams;

	const eventData = buildEventDataFromParams(params);

	const search = new URLSearchParams();
	for (const field in params) {
		search.append(field, String(params[field]));
	}

	if (!session?.user?.id) {
		// TODO: Add some error messaging via toast
		redirect("/plan".concat("?", search.toString()));
	}

	const [{ code }] = await createEvent({
		...eventData,
		createdBy: session.user.id,
	});

	if (!code) {
		// TODO: Add some error messaging via toast
		redirect("/plan".concat("?", search.toString()));
	}

	const slotData = buildSlotDataFromParams(params);

	if (slotData.length > 0) {
		await createSlots({
			code,
			slots: slotData as [
				{ count: number; item: string },
				...{ count: number; item: string }[],
			],
		});

		// TODO: Add handling if problem adding slots.
	}

	redirect(`/event/${code}`);
};

export default Page;
