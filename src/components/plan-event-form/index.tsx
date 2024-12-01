"use client";

import { useEffect } from "react";
import useAnchor from "@/hooks/use-anchor";
import { Step } from "@/components/manage-event-wizard";
import Form from "next/form";
import { EventData } from "@/@types/event";

type Props = {
	code: string | null;
	eventData: EventData;
	loggedIn: boolean;
	mode: "create" | "edit";
};

const PlanEventForm = ({ code, eventData, mode }: Props) => {
	const [anchor, scrollToAnchor] = useAnchor();

	useEffect(() => {
		if (anchor === Step.PLAN_FOOD) {
			scrollToAnchor(Step.PLAN_FOOD);
			return;
		}
	}, [anchor, scrollToAnchor]);

	return (
		<Form
			action={`/plan#${Step.PLAN_FOOD}`}
			className="form-control mx-2 w-full lg:w-3/4 2xl:w-10/12"
			name="create-event-form"
		>
			{mode === "create" && (
				<h1 className="mb-4 text-primary">Create an Event</h1>
			)}
			{mode === "edit" && (
				<h1 className="mb-4 text-primary">
					Edit Event: <span className="text-secondary">{code}</span>
				</h1>
			)}

			<div>
				<label className="label label-text" htmlFor="name-input">
					Event Name
				</label>
				<input
					autoComplete="off"
					className="input input-bordered w-full text-sm md:text-base"
					defaultValue={eventData.name}
					id="name-input"
					maxLength={256}
					name="name"
					placeholder="Untitled event"
					required
					type="text"
				/>
			</div>

			<div className="my-2 flex justify-between">
				<div className="w-5/12">
					<label className="label label-text" htmlFor="date-input">
						Date
					</label>
					<input
						className="input input-bordered w-full text-sm md:text-base"
						data-testid="start-date"
						defaultValue={eventData.startDate}
						name="startDate"
						id="date-input"
						required
						type="date"
					/>
				</div>

				<div className="w-5/12">
					<label className="label label-text text-sm" htmlFor="time-input">
						Time
					</label>
					<input
						className="input input-bordered w-full text-sm md:text-base"
						data-testid="start-time"
						defaultValue={eventData.startTime}
						id="time-input"
						name="startTime"
						required
						step={60}
						type="time"
					/>
				</div>
			</div>

			<div className="my-2">
				<label className="label label-text" htmlFor="location-input">
					Location
				</label>
				<input
					className="input input-bordered w-full text-sm md:text-base"
					defaultValue={eventData.location}
					id="location-input"
					maxLength={256}
					name="location"
					placeholder="Place name, address, or link"
					required
					type="text"
				/>
			</div>

			<div className="my-2">
				<label className="label label-text" htmlFor="hosts-input">
					Hosts
				</label>
				<div className="input input-bordered flex w-full items-center gap-2 text-sm md:text-base">
					<span className="badge badge-info badge-sm gap-2 md:badge-md">
						Optional
					</span>
					<input
						className="w-full"
						defaultValue={eventData.hosts}
						id="hosts-input"
						maxLength={256}
						name="hosts"
						placeholder="Defaults to Discord username"
						type="text"
					/>
				</div>
			</div>

			<div className="my-2">
				<label className="label label-text" htmlFor="description-input">
					Description
				</label>
				<div className="input input-bordered flex w-full items-center gap-2 text-sm md:text-base">
					<span className="badge badge-info badge-sm gap-2 md:badge-md">
						Optional
					</span>
					<input
						className="w-full"
						defaultValue={eventData.description}
						id="description-input"
						maxLength={256}
						name="description"
						placeholder="Add a description of your event"
						type="text"
					/>
				</div>
			</div>

			<button
				className="btn btn-primary my-6 w-full"
				disabled={anchor === Step.PLAN_FOOD}
				type="submit"
			>
				Next
			</button>
		</Form>
	);
};

export default PlanEventForm;

export const PlanEventFormFallback = () => {
	return (
		<div className="flex w-full flex-col gap-4">
			<div className="flex justify-around gap-2">
				<div className="skeleton h-16 w-full" />
			</div>
			<div className="flex justify-around gap-2">
				<div className="skeleton h-14 w-full" />
			</div>
			<div className="flex justify-around gap-2">
				<div className="skeleton h-14 w-1/2" />
				<div className="skeleton h-14 w-1/2" />
			</div>
			<div className="flex justify-around gap-2">
				<div className="skeleton h-14 w-full" />
			</div>
			<div className="flex justify-around gap-2">
				<div className="skeleton h-14 w-full" />
			</div>
			<div className="flex justify-around gap-2">
				<div className="skeleton h-14 w-full" />
			</div>
			<div className="flex justify-around gap-2">
				<div className="skeleton h-14 w-full" />
			</div>
		</div>
	);
};
