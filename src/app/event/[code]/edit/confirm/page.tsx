import createEvent from "@/actions/db/create-event";
import createSlots from "@/actions/db/create-slots";
import { auth } from "@/auth";
import {
	buildEventDataFromParams,
	buildSlotDataFromParams,
} from "@/utilities/build-data-from-params";
import { redirect } from "next/navigation";

type Props = {
	params: Promise<{ code: string }>;
	searchParams: Promise<{ [key: string]: string }>;
};

const Page = async ({ params, searchParams }: Props) => {
	const session = await auth();

	const search = await searchParams;

	const { code } = await params;

	const queryString = "?" + new URLSearchParams(search).toString();

	if (!session?.user?.id) {
		// TODO: Add some error messaging via toast
		redirect(`/event/${code}`);
	}

	/*
    const [eventData] = await buildEventDataFromParams(searchParams);
    /
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
            slots: slotData as [
                { count: number; item: string },
                ...{ count: number; item: string }[],
            ],
        });

        // TODO: Add handling if problem adding slots.
    }
        */

	// redirect(`/event/${code}`);
	return <div>Working...</div>;
};

export default Page;
