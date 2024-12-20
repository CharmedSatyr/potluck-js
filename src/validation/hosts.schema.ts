import { z } from "zod";

export const hosts = z.string().trim().max(100);
