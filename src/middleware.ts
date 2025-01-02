import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import findEventCreatedBy from "@/actions/db/find-event-created-by";

const isAuthenticated = async () => {
	const session = await auth();

	return Boolean(session?.user?.id);
};

const isCreator = async (pathname: string) => {
	const session = await auth();

	// pathname ends with /event/:code/edit or /event/:code/edit/confirm
	const match = pathname.match(/^\/event\/([^/]+)\/edit(\/confirm)?$/);

	if (!match) {
		return false;
	}

	const code = match[1];

	const [createdBy] = await findEventCreatedBy({ code });

	return createdBy?.id === session?.user?.id;
};

export const middleware = async (request: NextRequest) => {
	const { origin, pathname } = request.nextUrl;

	// Protected routes
	if (!(await isAuthenticated())) {
		return NextResponse.redirect(origin.concat("/oauth"));
	}

	// Creator-only routes
	if (
		!(await isCreator(pathname)) &&
		(pathname.endsWith("/edit") || pathname.endsWith("/confirm"))
	) {
		return NextResponse.redirect(origin.concat("/oauth"));
	}

	return NextResponse.next();
};

export const config = {
	matcher: [
		"/dashboard",
		"/event/:code/edit",
		"/event/:code/edit/confirm",
		"/plan/confirm",
	],
};
