"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import CopyLinkButton from "@/components/copy-link-button";
import { Event } from "@/db/schema/event";
import eventIsPassed from "@/utilities/event-is-passed";
import RsvpForm from "@/components/rsvp-form";
import { Rsvp } from "@/db/schema/rsvp";
import Image from "next/image";
import {
	CalendarIcon,
	ClockIcon,
	MapPinIcon,
} from "@heroicons/react/24/outline";
import { formatStartDate } from "@/utilities/format-start-date";
import { formatStartTime } from "@/utilities/format-start-time";
import WarningAlert from "@/components/warning-alert";

// TODO: Don't pass a whole event to the client.
export type EventSkeletonProps = Event & {
	rsvpResponse: Rsvp["response"] | null;
};

export const EventSkeleton = ({
	createdBy,
	description,
	hosts,
	location,
	name,
	code,
	startDate,
	startTime,
	rsvpResponse,
}: EventSkeletonProps) => {
	const session = useSession();
	const authenticated = session?.status === "authenticated";
	const isHost = session?.data?.user?.id === createdBy;
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
								alt={session.data?.user?.name ?? "Avatar"}
								className="avatar rounded-full border"
								src={session.data?.user?.image ?? ""}
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

			<div className="w-30 flex flex-col">
				{isHost && !isPassed && (
					<Link
						className="btn btn-accent btn-xs btn-sm mb-2"
						href={`/event/${code}/edit`}
					>
						Edit
					</Link>
				)}

				{authenticated && !isHost && !isPassed && (
					<div className="flex flex-col">
						<RsvpForm code={code} currentResponse={rsvpResponse} />
					</div>
				)}
			</div>
		</div>
	);
};

export default EventSkeleton;
