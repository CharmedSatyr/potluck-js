import { NextRequest, NextResponse } from "next/server";
import findUserIdByProviderAccountId from "@/actions/db/find-user-id-by-provider-account-id";

export const GET = async (request: NextRequest) => {
	const { searchParams } = request.nextUrl;

	const providerAccountId = searchParams.get("providerAccountId");

	if (!providerAccountId) {
		return NextResponse.json(null, { status: 400 });
	}

	const [user] = await findUserIdByProviderAccountId({ providerAccountId });

	return NextResponse.json({ exists: Boolean(user?.id) }, { status: 200 });
};
