import { z } from "zod";

export const location = z
	.string()
	.trim()
	.min(1, { message: "Location required." })
	.max(100);
