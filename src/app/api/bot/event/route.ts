import createEvent from "@/actions/db/create-event";
import { schema as createEventSchema } from "@/actions/db/create-event.schema";
import findUserIdByProviderAccountId from "@/actions/db/find-user-id-by-provider-account-id";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const POST = async (request: NextRequest) => {
	const data = await request.json();

	const schema = createEventSchema
		.omit({ createdBy: true, hosts: true })
		.extend({
			discordUserId: z.string().trim(),
		});

	const parsed = schema.safeParse(data);

	if (!parsed.success) {
		return NextResponse.json(
			{
				errors: parsed.error.flatten().fieldErrors,
				message: "Invalid parameters",
				success: false,
			},
			{ status: 400 }
		);
	}

	const { discordUserId, title, startDate, startTime, location, description } =
		parsed.data;

	const [createdBy] = await findUserIdByProviderAccountId({
		providerAccountId: discordUserId,
	});

	if (!createdBy) {
		return NextResponse.json(
			{
				message: "User account not found",
				success: false,
			},
			{ status: 401 }
		);
	}

	const [result] = await createEvent({
		createdBy: createdBy.id,
		title,
		startDate,
		startTime,
		location,
		description,
		hosts: "",
	});

	if (!result?.code) {
		return NextResponse.json(
			{
				message: "Failed to create event",
				success: false,
			},
			{ status: 500 }
		);
	}

	return NextResponse.json(
		{
			code: result.code,
			message: "Event created",
			success: true,
		},
		{ status: 200 }
	);
};
