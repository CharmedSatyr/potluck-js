"use client";

import { useDateTimeView } from "@/hooks/use-date-time-view";

type Props = {
	startUtcMs: number;
};

const DateCellContents = ({ startUtcMs }: Props) => {
	const { date } = useDateTimeView(startUtcMs);

	return <>{date}</>;
};

export default DateCellContents;
