"use client";

import { useLocalDateTime } from "@/hooks/use-local-date-time";

type Props = {
	startUtcMs: number;
};

const DateCellContents = ({ startUtcMs }: Props) => {
	const { date } = useLocalDateTime(startUtcMs);

	return <>{date}</>;
};

export default DateCellContents;
