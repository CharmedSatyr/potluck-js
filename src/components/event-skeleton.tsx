"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import CopyLinkButton from "@/components/copy-link-button";
import { Event } from "@/db/schema/event";

type EventSkeletonProps = Event;

export const EventSkeleton = ({
	createdBy,
	description,
	hosts,
	location,
	name,
	code,
	startDate,
	startTime,
}: EventSkeletonProps) => {
	const session = useSession();

	const isHost = session?.data?.user?.email === createdBy;

	return (
		<div className="w-full">
			<div className="float-right flex w-36 flex-col">
				{isHost && (
					<Link className="btn btn-accent mb-2" href={`/event/${code}/edit`}>
						Edit
					</Link>
				)}

				{code && <CopyLinkButton />}
			</div>

			{code && (
				<h1>
					Event Code: <span className="text-secondary">{code}</span>
				</h1>
			)}

			<h1 className="mb-6 w-full text-6xl text-primary">{name}</h1>

			<h2 className="my-7 font-normal">
				{startDate} at {startTime}
			</h2>

			<h2 className="my-6 font-normal">{location}</h2>

			<h3 className="my-4 font-bold">Hosted by {hosts}</h3>

			<div className="my-4">{description}</div>
		</div>
	);
};

export default EventSkeleton;
