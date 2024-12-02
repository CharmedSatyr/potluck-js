"use server";

import { signIn } from "@/auth";

export const loginAction = async (
	prevState: { path: string },
	formData: FormData
): Promise<any> => {
	const params = new URLSearchParams();
	for (const [key, val] of formData) {
		params.append(key, String(val));
	}

	params.append("source", "discord");
	await signIn("discord", {
		redirectTo: prevState.path.concat("?", params.toString()),
	});

	return prevState;
};
