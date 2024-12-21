import { NonEmptySlotDataArray } from "@/@types/slot";
import updateEvent from "@/actions/db/update-event";
import upsertSlots from "@/actions/db/upsert-slots";
import { auth } from "@/auth";
import {
	buildEventDataFromParams,
	buildSlotDataFromParams,
} from "@/utilities/build-data-from-params";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import genPageMetadata from "@/seo";

type MetadataProps = {
	params: Promise<{ code: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const generateMetadata = async ({
	params: paramsPromise,
}: MetadataProps): Promise<Metadata> => {
	const params = await paramsPromise;

	return genPageMetadata({ title: `${params?.code}` });
};

type Props = {
	params: Promise<{ code: string }>;
	searchParams: Promise<{ [key: string]: string }>;
};

const Page = async ({ params, searchParams }: Props) => {
	const session = await auth();

	const { code } = await params;

	const [eventData] = await buildEventDataFromParams(searchParams);

	const [result] = await updateEvent({
		...eventData,
		code,
		createdBy: session!.user!.id!,
	});

	if (!result.code) {
		// TODO: Add some error messaging via toast
		redirect(`/event/${code}`);
	}

	const slotData = await buildSlotDataFromParams(searchParams);

	if (slotData.length > 0) {
		await upsertSlots({
			code,
			slots: slotData as NonEmptySlotDataArray,
		});

		// TODO: Add handling if problem adding slots.
	}

	redirect(`/event/${code}`);
};

export default Page;
