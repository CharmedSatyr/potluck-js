"use client";

import { useEffect, useState } from "react";

const useTimezone = () => {
	const [timezone, setTimezone] = useState<string>(
		() => Intl.DateTimeFormat().resolvedOptions().timeZone
	);

	useEffect(() => {
		const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		if (detectedTimezone !== timezone) {
			setTimezone(detectedTimezone);
		}
	}, [timezone]);

	return timezone;
};

export default useTimezone;
