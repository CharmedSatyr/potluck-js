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
		<div className="w-4/6">
			{isHost && (
				<Link
					className="btn btn-primary float-right"
					href={`/party/${shortId}/edit`}
				>
					Edit
				</Link>
			)}

			{shortId && (
				<h1>
					Party Code: <span className="text-secondary">{shortId}</span>
				</h1>
			)}

			<h1 className="mb-3 w-full text-6xl text-primary">{name}</h1>

			<h2 className="my-3">
				{startDate} at {startTime}
			</h2>

			<h2 className="my-2">{location}</h2>

			<h3 className="my-2">Hosted by {hosts}</h3>

			<div className="my-0">{description}</div>
		</div>
	);
};

export default EventSkeleton;