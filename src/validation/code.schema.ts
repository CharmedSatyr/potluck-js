import { z } from "zod";
import { EVENT_CODE_LENGTH } from "@/constants/event-code-length";

export const code = z.string().trim().length(EVENT_CODE_LENGTH).readonly();
