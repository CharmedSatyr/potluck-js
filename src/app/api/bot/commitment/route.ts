import { z } from "zod";
import createCommitment from "@/actions/db/create-commitment";
import { schema as createCommitmentSchema } from "@/actions/db/create-commitment.schema";
import findUserIdByProviderAccountId from "@/actions/db/find-user-id-by-provider-account-id";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
	const data = await request.json();

	const schema = createCommitmentSchema.omit({ createdBy: true }).extend({
		discordUserId: z.string().trim(),
	});

	const parsed = schema.safeParse(data);

	if (!parsed.success) {
		return NextResponse.json(
			{
				errors: parsed.error.flatten().fieldErrors,
				message: "Invalid parameters",
			},
			{ status: 400 }
		);
	}

	const { discordUserId, description, quantity, slotId } = parsed.data;

	const [createdBy] = await findUserIdByProviderAccountId({
		providerAccountId: discordUserId,
	});

	if (!createdBy) {
		return NextResponse.json(null, { status: 401 });
	}

	const [result] = await createCommitment({
		createdBy: createdBy.id,
		description,
		quantity,
		slotId,
	});

	if (!result?.id) {
		return NextResponse.json(null, { status: 500 });
	}

	return NextResponse.json(null, { status: 200 });
};
