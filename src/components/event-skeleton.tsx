import CopyLinkButton from "@/components/copy-link-button";
import eventIsPassed from "@/utilities/event-is-passed";
import Image from "next/image";
import {
	CalendarIcon,
	ClockIcon,
	MapPinIcon,
} from "@heroicons/react/24/outline";
import { formatStartDate } from "@/utilities/format-start-date";
import { formatStartTime } from "@/utilities/format-start-time";
import WarningAlert from "@/components/warning-alert";

type Props = {
	authenticated: boolean;
	code: string;
	creator: {
		image: string;
		name: string;
	};
	description: string;
	hosts: string;
	location: string;
	name: string;
	startDate: string;
	startTime: string;
};

export const EventSkeleton = ({
	authenticated,
	code,
	creator,
	description,
	hosts,
	location,
	name,
	startDate,
	startTime,
}: Props) => {
	const isPassed = eventIsPassed(startDate);

	return (
		<div className="flex w-full justify-between">
			<div className="max-w-md">
				<h1 className="mb-4 text-5xl font-bold text-primary">{name}</h1>
				<div className="font-bold">
					Event Code: <CopyLinkButton text={code} />
				</div>

				{authenticated ? (
					<>
						<p className="flex items-center gap-2">
							<CalendarIcon className="h-4 w-4" /> {formatStartDate(startDate)}{" "}
							at <ClockIcon className="h-4 w-4" /> {formatStartTime(startTime)}
						</p>
						<p className="flex items-center gap-2">
							<MapPinIcon className="h-4 w-4" /> {location}
						</p>
						<p className="flex h-6 items-center gap-2">
							<Image
								alt={`${creator.name}'s Avatar`}
								className="avatar rounded-full border"
								src={creator.image}
								height="20"
								width="20"
							/>
							Hosted by {hosts}
						</p>
						<p>{description}</p>
						{isPassed && (
							<WarningAlert text="This event takes place in the past." />
						)}
					</>
				) : (
					<p>Sign In to see all the details!</p>
				)}
			</div>
		</div>
	);
};

export default EventSkeleton;
