import { NextRequest, NextResponse } from "next/server";
import { auth, signIn } from "@/auth";

export const GET = async (request: NextRequest) => {
	const { origin, search, searchParams } = request.nextUrl;

	const code = searchParams.get("code");
	const source = searchParams.get("source");

	if (!code || source !== "discord") {
		return NextResponse.redirect(origin.concat("/oauth"));
	}

	const session = await auth();

	if (!session?.user?.id) {
		return await signIn("discord", {
			redirectTo: origin
				.concat(`/event/${code}/edit`)
				.concat(search)
				.concat("#plan-food"),
		});
	}

	return NextResponse.redirect(
		origin.concat(`/event/${code}/edit`).concat(search).concat("#plan-food")
	);
};
