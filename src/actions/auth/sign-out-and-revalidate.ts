"use server";

import { signOut } from "@/auth";
import { revalidatePath } from "next/cache";

const signOutAndRevalidate = async () => {
	await signOut({ redirectTo: "/" });

	revalidatePath("/", "layout");
};

export default signOutAndRevalidate;
