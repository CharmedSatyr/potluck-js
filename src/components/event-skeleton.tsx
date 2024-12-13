import { auth } from "@/auth";
import CopyLinkButton from "@/components/copy-link-button";
import Image from "next/image";
import {
	CalendarIcon,
	ClockIcon,
	MapPinIcon,
} from "@heroicons/react/24/outline";
import WarningAlert from "@/components/warning-alert";
import findEvent from "@/actions/db/find-event";
import findUserByEventCode from "@/actions/db/find-user-by-event-code";
import eventIsPassed from "@/utilities/event-is-passed";
import { formatStartDate } from "@/utilities/format-start-date";
import { formatStartTime } from "@/utilities/format-start-time";

type Props = {
	code: string;
};

export const EventHeader = ({
	code,
	title,
}: {
	code: string;
	title: string;
}) => {
	return (
		<>
			<h1 className="mb-4 text-5xl font-bold text-primary md:text-6xl">
				{title}
			</h1>
			<div className="font-bold">
				Event Code: <CopyLinkButton text={code} />
			</div>
		</>
	);
};

const EventSkeleton = async ({ code }: Props) => {
	const [event] = await findEvent({ code });
	const [creator] = await findUserByEventCode({ code });

	const { description, hosts, location, startDate, startTime, title } = event;

	const isPassed = eventIsPassed(startDate);

	return (
		<div className="w-full">
			<EventHeader code={code} title={title} />

			<p className="flex items-center gap-2">
				<CalendarIcon className="h-4 w-4" /> {formatStartDate(startDate)} at{" "}
				<ClockIcon className="h-4 w-4" /> {formatStartTime(startTime)}
			</p>
			<p className="flex items-center gap-2">
				<MapPinIcon className="h-4 w-4" /> {location}
			</p>
			<p className="flex h-6 items-center gap-2">
				<Image
					alt={`${creator.name}'s Avatar`}
					className="avatar rounded-full border"
					src={creator.image!}
					height="20"
					width="20"
				/>
				Hosted by {hosts || creator.name}
			</p>
			<p>{description}</p>

			{isPassed && <WarningAlert text="This event date is in the past." />}
		</div>
	);
};

export default EventSkeleton;

export const EventSkeletonFallback = () => {
	return (
		<div className="mb-2 flex w-full flex-col gap-4">
			<div className="skeleton h-12 w-3/4 md:h-16" />
			<div className="skeleton h-8 w-1/2" />
			<div className="flex gap-2">
				<div className="skeleton h-8 w-8 shrink-0 rounded-full"></div>
				<div className="skeleton h-8 w-3/12" />
				<div className="skeleton h-8 w-8 shrink-0 rounded-full"></div>
				<div className="skeleton h-8 w-2/12" />
			</div>
			<div className="flex gap-2">
				<div className="skeleton h-8 w-8 shrink-0 rounded-full"></div>
				<div className="skeleton h-8 w-1/2" />
			</div>
			<div className="flex gap-2">
				<div className="skeleton h-8 w-8 shrink-0 rounded-full"></div>
				<div className="skeleton h-8 w-7/12" />
			</div>
			<div className="skeleton h-8 w-3/4" />
		</div>
	);
};
