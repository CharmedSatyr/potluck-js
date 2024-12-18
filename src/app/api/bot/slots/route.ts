import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
	const { searchParams } = request.nextUrl;

	const code = searchParams.get("code");

	return NextResponse.json(
		{
			message: `Received code ${code}`,
			success: true,
		},
		{ status: 200 }
	);
};
