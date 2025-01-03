"use client";

import { useEffect, useState, useMemo } from "react";
import { DateTime } from "luxon";
import { DEFAULT_TIMEZONE } from "@/constants/default-timezone";

/** This is a hook to ensure it is calculated using client timezone/locale. */
export const useDateTimeView = (utcMs: number) => {
	const [timezone, setTimezone] = useState<string>(DEFAULT_TIMEZONE);

	useEffect(() => {
		const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		if (detectedTimezone !== timezone) {
			setTimezone(detectedTimezone);
		}
	}, [timezone]);

	const dt = useMemo(
		() => DateTime.fromMillis(utcMs, { zone: timezone }),
		[utcMs, timezone]
	);

	const date = useMemo(() => dt.toLocaleString(DateTime.DATE_FULL), [dt]);
	const time = useMemo(() => dt.toLocaleString(DateTime.TIME_SIMPLE), [dt]);

	return { date, time };
};
