"use client";

import { use, useActionState, useCallback, useEffect } from "react";
import useAnchor from "@/hooks/use-anchor";
import { usePathname, useSearchParams } from "next/navigation";
import {
	PlanEventFormData,
	PlanEventFormState,
} from "@/app/start/submit-actions.schema";

type Props = {
	code: string | null;
	eventDataPromise: Promise<PlanEventFormData[]>;
	submitAction: (
		prevState: PlanEventFormState,
		formData: FormData
	) => Promise<PlanEventFormState>;
};

const FormErrorAlert = ({ text }: { text: string }) => {
	if (!text) {
		return null;
	}

	return (
		<div role="alert" className="alert mt-2 py-1 text-warning">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/>
			</svg>

			<span>{text}</span>
		</div>
	);
};

const PlanEventForm = ({ code, eventDataPromise, submitAction }: Props) => {
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

	const [eventData] = use(eventDataPromise);

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
					className={`input input-bordered w-full ${state?.errors?.fieldErrors?.name ? "input-warning" : ""}`}
					defaultValue={state?.fields.name}
					id="name-input"
					maxLength={256}
					name="name"
					placeholder="Untitled event"
					required
					type="text"
				/>
				{state?.errors?.fieldErrors.name && (
					<FormErrorAlert text={state?.errors?.fieldErrors.name?.join(" ")} />
				)}
			</div>

			<div className="my-2 flex justify-between">
				<div className="w-5/12">
					<label className="label label-text" htmlFor="date-input">
						Date
					</label>
					<input
						className="input input-bordered w-full"
						data-testid="start-date"
						defaultValue={state?.fields.startDate}
						name="startDate"
						id="date-input"
						required
						type="date"
					/>
					{state?.errors?.fieldErrors.startDate && (
						<FormErrorAlert
							text={state?.errors?.fieldErrors.startDate?.join(" ")}
						/>
					)}
				</div>

				<div className="w-5/12">
					<label className="label label-text" htmlFor="time-input">
						Time
					</label>
					<input
						className="input input-bordered w-full"
						data-testid="start-time"
						defaultValue={state?.fields.startTime}
						id="time-input"
						name="startTime"
						required
						step={60}
						type="time"
					/>
					{state?.errors?.fieldErrors.startTime && (
						<FormErrorAlert
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
					className="input input-bordered w-full"
					defaultValue={state?.fields.location}
					id="location-input"
					maxLength={256}
					name="location"
					placeholder="Place name, address, or link"
					required
					type="text"
				/>
				{state?.errors?.fieldErrors.location && (
					<FormErrorAlert
						text={state?.errors?.fieldErrors.location?.join(" ")}
					/>
				)}
			</div>

			<div className="my-2">
				<label className="label label-text" htmlFor="host-input">
					Hosts
				</label>
				<div className="input input-bordered flex w-full items-center gap-2">
					<div className="badge badge-info gap-2">optional</div>
					<input
						className="w-full"
						defaultValue={state?.fields.hosts}
						id="description-input"
						maxLength={256}
						name="hosts"
						placeholder="Non-Discord names or nicknames"
						type="text"
					/>
				</div>

				{state?.errors?.fieldErrors.hosts && (
					<FormErrorAlert text={state?.errors?.fieldErrors.hosts?.join(" ")} />
				)}
			</div>

			<div className="my-2">
				<label className="label label-text" htmlFor="description-input">
					Description
				</label>
				<div className="input input-bordered flex w-full items-center gap-2">
					<div className="badge badge-info gap-2">optional</div>
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
					<FormErrorAlert
						text={state?.errors?.fieldErrors.description?.join(" ")}
					/>
				)}
			</div>

			<button
				className="btn btn-primary my-6 w-full"
				disabled={isPending || anchor === "plan-food"}
				type="submit"
			>
				Next
			</button>
		</form>
	);
};

export default PlanEventForm;
