import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import findEventCreatedBy from "@/actions/db/find-event-created-by";

export const middleware = async (request: NextRequest) => {
	const { origin, pathname, search } = request.nextUrl;

	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.redirect(origin.concat("/oauth").concat(search));
	}

	// pathname ends with /event/:code/edit or /event/:code/edit/confirm
	const match = pathname.match(/^\/event\/([^/]+)\/edit(\/confirm)?$/);

	if (match) {
		const code = match[1];

		const [createdBy] = await findEventCreatedBy({ code });

		if (createdBy?.id !== session?.user?.id) {
			return NextResponse.redirect(origin.concat("/oauth").concat(search));
		}
	}

	return NextResponse.next();
};

export const config = {
	matcher: ["/plan/confirm", "/event/:code/edit", "/event/:code/edit/confirm"],
};
