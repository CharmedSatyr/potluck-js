"use client";

import Link from "next/link";
import { EventData, EventInput } from "@/@types/event";
import { useLocalDateTime } from "@/hooks/use-local-date-time";
import useTimezone from "@/hooks/use-timezone";

type Props = {
	code: string;
	eventData: EventData;
};

const EditLink = ({ code, eventData }: Props) => {
	const { description, hosts, location, startUtcMs, title } = eventData;

	const timezone = useTimezone();
	const { dateIso, time24 } = useLocalDateTime(startUtcMs);

	const query: EventInput = {
		description,
		hosts,
		location,
		startDate: dateIso,
		startTime: time24,
		title,
		timezone,
	};

	return (
		<Link
			className="btn btn-accent mb-2 w-full md:w-28"
			href={{
				pathname: `/event/${code}/edit`,
				query,
			}}
		>
			Edit
		</Link>
	);
};

export default EditLink;
