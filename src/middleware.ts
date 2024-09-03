import { auth } from "@/auth";
import { NextResponse } from "next/server";

const protectedRoutes = new Set(["/start/plan-food"]);

export const middleware = auth((request) => {
	if (!request.auth && protectedRoutes.has(request.nextUrl.pathname)) {
		return NextResponse.redirect(new URL("/", request.url));
	}
});

export default middleware;
