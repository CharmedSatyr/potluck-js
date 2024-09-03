import Link from "next/link";

interface EventSkeletonProps {
	name: string;
	shortId: string;
	startDate: string;
	startTime: string;
	location: string;
	hosts: string;
	description: string | null;
	isHost: boolean;
}

export const EventSkeleton = ({
	name,
	shortId,
	startDate,
	startTime,
	location,
	hosts,
	description,
	isHost,
}: EventSkeletonProps) => {
	return (
		<div className="w-full lg:w-5/6 xl:w-2/3 2xl:w-1/2">
			{isHost && (
				<Link
					className="btn btn-primary float-right"
					href={`/event/${shortId}/edit`}
				>
					Edit
				</Link>
			)}

			{shortId && (
				<h1>
					Event Code: <span className="text-secondary">{shortId}</span>
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
