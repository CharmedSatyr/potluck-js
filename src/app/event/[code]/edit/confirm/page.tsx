import updateEvent from "@/actions/db/update-event";
import upsertSlots from "@/actions/db/upsert-slots";
import { auth } from "@/auth";
import {
	buildEventDataFromParams,
	buildSlotDataFromParams,
} from "@/utilities/build-data-from-params";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type Props = {
	params: Promise<{ code: string }>;
	searchParams: Promise<{ [key: string]: string }>;
};

const Page = async ({ params, searchParams }: Props) => {
	const session = await auth();

	const { code } = await params;

	if (!session?.user?.id) {
		// TODO: Add some error messaging via toast
		redirect(`/event/${code}`);
	}

	const [eventData] = await buildEventDataFromParams(searchParams);

	const [result] = await updateEvent({
		...eventData,
		code,
		createdBy: session.user.id,
	});

	if (!result.code) {
		// TODO: Add some error messaging via toast
		redirect(`/event/${code}`);
	}

	const slotData = await buildSlotDataFromParams(searchParams);

	if (slotData.length > 0) {
		await upsertSlots({
			code,
			slots: slotData as [
				{ count: number; id?: string; item: string },
				...{ count: number; id?: string; item: string }[],
			],
		});

		// TODO: Add handling if problem adding slots.
	}

	redirect(`/event/${code}`);
};

export default Page;
