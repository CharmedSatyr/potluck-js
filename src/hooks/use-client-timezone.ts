"use client";

import { DEFAULT_TIMEZONE } from "@/constants/default-timezone";
import { useEffect, useState } from "react";

const useClientTimezone = (): string => {
	const [timezone, setTimezone] = useState<string>(DEFAULT_TIMEZONE);
	useEffect(() => {
		const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		setTimezone(detectedTimezone);
	}, []);

	return timezone;
};

export default useClientTimezone;
