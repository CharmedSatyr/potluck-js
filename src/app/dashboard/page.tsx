import findEventsByUser from "@/actions/db/find-events-by-user";
import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import eventIsPassed from "@/utilities/event-is-passed";
import findEventsByUserWithRsvp from "@/actions/db/find-events-by-user-with-rsvp";
import { Suspense } from "react";
import SlideIn from "@/components/slide-in";
import DeleteEventForm from "@/components/delete-event-button";
import { TableFallback } from "@/app/dashboard/table-fallback";
import genPageMetadata from "@/seo";
import { formatStartDate } from "@/utilities/format-start-date";

export const metadata = genPageMetadata({ title: "Dashboard" });

const HostingTable = async () => {
	const session = await auth();
	const hosted = await findEventsByUser({ createdBy: session!.user!.id! });

	if (!hosted?.length) {
		return (
			<div>
				You haven&apos;t hosted any events.{" "}
				<Link href="/plan">Go throw a party!</Link>
			</div>
		);
	}

	return (
		<div className="max-h-96 overflow-x-auto">
			<table className="table table-pin-rows table-sm md:table-lg">
				<thead>
					<tr>
						<th>Code</th>
						<th>Name</th>
						<th>Date</th>
						<th className="hidden md:table-cell">Location</th>
						<th className="hidden md:table-cell"></th>
					</tr>
				</thead>
				<tbody>
					{hosted.map((event) => {
						const passed = eventIsPassed(event.startDate);

						return (
							<tr key={event.id} className={passed ? "bg-base-300" : ""}>
								<td className="font-bold">
									<Link className="btn btn-sm" href={`/event/${event.code}`}>
										<span className={passed ? "text-error" : "text-success"}>
											{event.code}
										</span>
									</Link>
								</td>
								<td>{event.title}</td>
								<td>{formatStartDate(event.startDate)}</td>
								<td className="hidden md:table-cell">{event.location}</td>
								<td className="hidden md:table-cell">
									<DeleteEventForm
										className="btn-sm"
										code={event.code}
										redirect={false}
									/>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

const AttendingTable = async () => {
	const session = await auth();
	const rsvps = await findEventsByUserWithRsvp({ id: session!.user!.id! });

	if (!rsvps?.length) {
		return (
			<div>
				You haven&apos;t attended any events.{" "}
				<Link href="/plan">Go throw a party!</Link>
			</div>
		);
	}

	return (
		<div className="max-h-96 overflow-x-auto">
			<table className="table table-pin-rows table-sm md:table-lg">
				<thead>
					<tr>
						<th>Code</th>
						<th>Name</th>
						<th>Date</th>
						<th className="hidden md:table-cell">Location</th>
					</tr>
				</thead>
				<tbody>
					{rsvps.map((event) => {
						const passed = eventIsPassed(event.startDate);

						return (
							<tr key={event.code} className={passed ? "bg-base-300" : ""}>
								<td className="font-bold">
									<Link className="btn btn-sm" href={`/event/${event.code}`}>
										<span className={passed ? "text-error" : "text-success"}>
											{event.code}
										</span>
									</Link>
								</td>
								<td>{event.title}</td>
								<td>{event.startDate}</td>
								<td className="hidden md:table-cell">{event.location}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

const DashboardPage = async () => {
	const session = await auth();

	if (!session?.user?.id) {
		redirect("/");
	}

	return (
		<main className="w-full">
			<h1 className="text-primary">Dashboard</h1>

			<SlideIn>
				<h2>Hosting</h2>
				<Suspense fallback={<TableFallback />}>
					<HostingTable />
				</Suspense>
			</SlideIn>

			<SlideIn>
				<h2>Attending</h2>
				<Suspense fallback={<TableFallback />}>
					<AttendingTable />
				</Suspense>
			</SlideIn>
		</main>
	);
};

export default DashboardPage;
