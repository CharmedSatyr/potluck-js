import { z } from "zod";
import { EVENT_CODE_LENGTH } from "@/db/schema/event";

export const code = z.string().trim().length(EVENT_CODE_LENGTH);
