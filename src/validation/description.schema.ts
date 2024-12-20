import { z } from "zod";

export const description = z.string().trim().max(256);
