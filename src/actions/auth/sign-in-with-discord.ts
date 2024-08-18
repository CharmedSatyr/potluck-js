"use server";

import { signIn } from "@/auth";

const signInWithDiscord = async () => {
	await signIn("discord");
};

export default signInWithDiscord;
