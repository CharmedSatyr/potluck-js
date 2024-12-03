import { NonEmptySlotDataArray } from "@/@types/slot";
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

	const queryString = "?" + new URLSearchParams(params).toString();

	if (!session?.user?.id) {
		// TODO: Add some error messaging via toast
		redirect("/plan".concat(queryString));
	}

	const [eventData] = await buildEventDataFromParams(searchParams);
	const [{ code }] = await createEvent({
		...eventData,
		createdBy: session.user.id,
	});

	if (!code) {
		// TODO: Add some error messaging via toast
		redirect("/plan".concat(queryString));
	}

	const slotData = await buildSlotDataFromParams(searchParams);

	if (slotData.length > 0) {
		await createSlots({
			code,
			slots: slotData as NonEmptySlotDataArray,
		});

		// TODO: Add handling if problem adding slots.
	}

	redirect(`/event/${code}`);
};

export default Page;
