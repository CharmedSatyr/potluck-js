"use client";

import { useActionState, useCallback, useEffect } from "react";
import useAnchor from "@/hooks/use-anchor";
import { usePathname, useSearchParams } from "next/navigation";
import {
	PlanEventFormData,
	PlanEventFormState,
} from "@/app/start/submit-actions.schema";
import WarningAlert from "../warning-alert";
import { DiscordIcon } from "../icons/discord";

type Props = {
	code: string | null;
	eventData: PlanEventFormData;
	loggedIn: boolean;
	submitAction: (
		prevState: PlanEventFormState,
		formData: FormData
	) => Promise<PlanEventFormState>;
};

const PlanEventForm = ({ code, eventData, loggedIn, submitAction }: Props) => {
	const path = usePathname();
	const searchParams = useSearchParams();
	const [anchor, scrollToAnchor] = useAnchor();

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);

			return params.toString();
		},
		[searchParams]
	);

	const [state, submit, isPending] = useActionState<
		PlanEventFormState,
		FormData
	>(submitAction, {
		fields: eventData,
		message: "",
		path,
		success: false,
	});

	useEffect(() => {
		if (!code || !state) {
			return;
		}

		state.code = code;
	}, [code, state]);

	useEffect(() => {
		if (!state?.code) {
			return;
		}

		if (anchor !== "plan-food" && !state.success) {
			return;
		}

		state.success = false;

		const query = "?" + createQueryString("code", state.code);
		scrollToAnchor("plan-food", query);
	}, [anchor, createQueryString, scrollToAnchor, state]);

	return (
		<form
			action={submit}
			className="form-control mx-2 w-full lg:w-3/4 2xl:w-10/12"
			name="create-event-form"
		>
			<h1 className="mb-4 text-primary">Create an Event</h1>

			<div>
				<label className="label label-text" htmlFor="name-input">
					Event Name
				</label>
				<input
					className={`input input-bordered w-full text-sm md:text-base ${state?.errors?.fieldErrors?.name ? "input-warning" : ""}`}
					defaultValue={state?.fields.name}
					id="name-input"
					maxLength={256}
					name="name"
					placeholder="Untitled event"
					required
					type="text"
				/>
				{state?.errors?.fieldErrors.name && (
					<WarningAlert text={state?.errors?.fieldErrors.name?.join(" ")} />
				)}
			</div>

			<div className="my-2 flex justify-between">
				<div className="w-5/12">
					<label className="label label-text" htmlFor="date-input">
						Date
					</label>
					<input
						className="input input-bordered w-full text-sm md:text-base"
						data-testid="start-date"
						defaultValue={state?.fields.startDate}
						name="startDate"
						id="date-input"
						required
						type="date"
					/>
					{state?.errors?.fieldErrors.startDate && (
						<WarningAlert
							text={state?.errors?.fieldErrors.startDate?.join(" ")}
						/>
					)}
				</div>

				<div className="w-5/12">
					<label className="label label-text text-sm" htmlFor="time-input">
						Time
					</label>
					<input
						className="input input-bordered w-full text-sm md:text-base"
						data-testid="start-time"
						defaultValue={state?.fields.startTime}
						id="time-input"
						name="startTime"
						required
						step={60}
						type="time"
					/>
					{state?.errors?.fieldErrors.startTime && (
						<WarningAlert
							text={state?.errors?.fieldErrors.startTime?.join(" ")}
						/>
					)}
				</div>
			</div>

			<div className="my-2">
				<label className="label label-text" htmlFor="location-input">
					Location
				</label>
				<input
					className="input input-bordered w-full text-sm md:text-base"
					defaultValue={state?.fields.location}
					id="location-input"
					maxLength={256}
					name="location"
					placeholder="Place name, address, or link"
					required
					type="text"
				/>
				{state?.errors?.fieldErrors.location && (
					<WarningAlert text={state?.errors?.fieldErrors.location?.join(" ")} />
				)}
			</div>

			<div className="my-2">
				<label className="label label-text" htmlFor="host-input">
					Hosts
				</label>
				<div className="input input-bordered flex w-full items-center gap-2 text-sm md:text-base">
					<span className="badge badge-info badge-sm gap-2 md:badge-md">
						Optional
					</span>
					<input
						className="w-full"
						defaultValue={state?.fields.hosts}
						id="hosts-input"
						maxLength={256}
						name="hosts"
						placeholder="Defaults to Discord username"
						type="text"
					/>
				</div>

				{state?.errors?.fieldErrors.hosts && (
					<WarningAlert text={state?.errors?.fieldErrors.hosts?.join(" ")} />
				)}
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
						defaultValue={state?.fields.description}
						id="description-input"
						maxLength={256}
						name="description"
						placeholder="Add a description of your event"
						type="text"
					/>
				</div>
				{state?.errors?.fieldErrors.description && (
					<WarningAlert
						text={state?.errors?.fieldErrors.description?.join(" ")}
					/>
				)}
			</div>

			<button
				className="btn btn-primary my-6 w-full"
				disabled={isPending || anchor === "plan-food"}
				type="submit"
			>
				{loggedIn ? (
					"Next"
				) : (
					<>
						Sign In with Discord <DiscordIcon className="size-4" />
					</>
				)}
			</button>
		</form>
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
