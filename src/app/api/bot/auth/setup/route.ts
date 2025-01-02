import { NextRequest } from "next/server";
import { signIn } from "@/auth";

export const GET = async (request: NextRequest) => {
	const { origin } = request.nextUrl;

	return await signIn("discord", {
		redirectTo: origin.concat("/settings").concat("?setup=true"),
	});
};
