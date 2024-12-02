import createEvent from "@/actions/db/create-event";
import createSlots from "@/actions/db/create-slots";
import { auth, signIn } from "@/auth";
import { DiscordIcon } from "@/components/icons/discord";
import {
	buildEventDataFromParams,
	buildSlotDataFromParams,
} from "@/utilities/build-data-from-params";
import Form from "next/form";
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
		return (
			<Form
				action={async () => {
					"use server";
					await signIn("discord", {
						redirectTo: "/plan/confirm".concat("?", search.toString()),
					});
				}}
				className="flex w-1/4 w-full flex-col items-center justify-center rounded-xl bg-base-300 p-8 text-center"
			>
				<h1 className="mb-0 text-4xl">Click below to sign in</h1>
				<p>
					<span className="font-bold text-secondary">{eventData.name}</span>{" "}
					will be created once you're back.
				</p>
				<button className="btn btn-accent flex items-center" type="submit">
					Sign In with Discord <DiscordIcon className="size-4" />
				</button>
			</Form>
		);
	}

	const [{ code }] = await createEvent({
		...eventData,
		createdBy: session.user.id,
	});

	if (!code) {
		// TODO: Add some error messaging.
		redirect("/plan".concat("?", search.toString()));
	}

	const slotData = buildSlotDataFromParams(params);

	if (slotData.length > 0) {
		const slots = await createSlots({
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
