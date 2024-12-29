import { z } from "zod";
import { schema as upsertRsvpSchema } from "@/actions/db/upsert-rsvp.schema";
import findUserIdByProviderAccountId from "@/actions/db/find-user-id-by-provider-account-id";
import { NextRequest, NextResponse } from "next/server";
import upsertRsvp from "@/actions/db/upsert-rsvp";

export const POST = async (request: NextRequest) => {
	const data = await request.json();

	const schema = upsertRsvpSchema.omit({ createdBy: true }).extend({
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

	const { code, discordUserId, message, response } = parsed.data;

	const [createdBy] = await findUserIdByProviderAccountId({
		providerAccountId: discordUserId,
	});

	if (!createdBy) {
		// TODO: This only handles if the guest has a PQ account! They should still be accounted for regardless.
		// Accept total number of guests from bot and keep that updated.
		return NextResponse.json(
			{
				message: "User account not found",
				success: false,
			},
			{ status: 401 }
		);
	}
	const result = await upsertRsvp({
		code,
		createdBy: createdBy.id,
		message,
		response,
	});

	if (!result?.success) {
		return NextResponse.json(
			{
				message: "Failed to create commitment",
				success: false,
			},
			{ status: 500 }
		);
	}

	return NextResponse.json(null, { status: 200 });
};
