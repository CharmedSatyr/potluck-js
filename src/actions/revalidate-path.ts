"use server";

import { revalidatePath } from "next/cache";

// TODO: A lot of this can be replaced with revalidate tags
// once use cache becomes less experimental.
export const revalidatePage = async (path: string) => {
	revalidatePath(path, "page");
};

export const revalidateLayout = async (path: string) => {
	revalidatePath(path, "layout");
};
