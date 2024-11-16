"use server";

import { signIn } from "@/auth";
import { revalidatePath } from "next/cache";

const signInWithDiscordAndRevalidate = async () => {
	await signIn("discord");

	revalidatePath("/", "layout");
};

export default signInWithDiscordAndRevalidate;
