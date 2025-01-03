"use client";

import { useDateTimeView } from "@/hooks/use-date-time-view";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";

type Props = {
	startUtcMs: number;
};

const DateTimeBlock = ({ startUtcMs }: Props) => {
	const { date, time } = useDateTimeView(startUtcMs);

	return (
		<p className="flex items-center gap-2">
			<CalendarIcon className="h-4 w-4" /> {date} at{" "}
			<ClockIcon className="h-4 w-4" /> {time}
		</p>
	);
};

export default DateTimeBlock;
