import { z } from "zod";

export const title = z
	.string()
	.trim()
	.min(1, { message: "Title required." })
	.max(100);
