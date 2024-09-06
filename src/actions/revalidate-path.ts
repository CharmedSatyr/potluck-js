"use server";

import { revalidatePath } from "next/cache";

export const revalidatePage = async (path: string) => {
	revalidatePath(path, "page");
};

export const revalidateLayout = async (path: string) => {
	revalidatePath(path, "layout");
};
