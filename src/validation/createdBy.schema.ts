import { z } from "zod";

export const createdBy = z.string().trim().uuid();
