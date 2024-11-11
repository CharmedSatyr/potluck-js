"use client";

import { useActionState, useCallback, useEffect } from "react";
import useAnchor from "@/hooks/use-anchor";
import { usePathname, useSearchParams } from "next/navigation";
import {
	PlanEventFormData,
	PlanEventFormState,
} from "@/app/start/submit-actions.types";

type Props = {
	code: string | null;
	eventData: PlanEventFormData;
	submitAction: (
		prevState: PlanEventFormState,
		formData: FormData
	) => Promise<PlanEventFormState>;
};

const PlanEventForm = ({ code, eventData, submitAction }: Props) => {
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
			className="flex max-h-96 flex-col justify-between"
			name="create-event-form"
		>
			<input
				className="w-full border-b-2 border-base-100 bg-inherit text-6xl font-extrabold text-primary focus:border-neutral focus:outline-none"
				defaultValue={state?.fields.name}
				name="name"
				placeholder="Untitled Event"
				required
				type="text"
			/>
			<span className="mb-2 text-secondary">
				{state?.errors?.fieldErrors.name?.join(" ")}
			</span>

			<div className="flex items-center justify-between">
				<input
					className="border-base-100 bg-inherit text-2xl focus:border-b-2 focus:border-neutral focus:outline-none"
					data-testid="start-date"
					defaultValue={state?.fields.startDate}
					name="startDate"
					type="date"
					required
				/>{" "}
				<span className="text-2xl font-bold"> at </span>
				<input
					className="w-4/12 border-b-2 border-base-100 bg-inherit text-2xl focus:border-neutral focus:outline-none"
					data-testid="start-time"
					defaultValue={state?.fields.startTime}
					name="startTime"
					step={60}
					required
					type="time"
				/>
			</div>
			<div>
				<span className="mt-0 text-secondary">
					{state?.errors?.fieldErrors.startDate?.join(" ")}
				</span>
				<span className="float-right mb-2 mt-0 text-secondary">
					{state?.errors?.fieldErrors.startTime?.join(" ")}
				</span>
			</div>

			<div className="mb-4 mt-2">
				<input
					className="my-2 w-full border-b-2 border-base-100 bg-inherit text-2xl focus:border-neutral focus:outline-none"
					defaultValue={state?.fields.location}
					name="location"
					placeholder="Place name, address, or link"
					required
					type="text"
				/>
				<span className="mb-2 text-secondary">
					{state?.errors?.fieldErrors.location?.join(" ")}
				</span>
			</div>

			<div className="flex flex-col">
				<div className="flex items-center justify-between">
					<input
						className="w-8/12 border-b-2 border-base-100 bg-inherit text-xl focus:border-neutral focus:outline-none"
						defaultValue={state?.fields.hosts}
						name="hosts"
						placeholder={"(optional) Nickname"}
						type="text"
					/>
				</div>
				<span className="mb-2 text-secondary">
					{state?.errors?.fieldErrors.hosts?.join(" ")}
				</span>
			</div>

			<input
				className="my-2 w-full border-b-2 border-base-100 bg-inherit focus:border-neutral focus:outline-none"
				defaultValue={state?.fields.description}
				name="description"
				placeholder="(optional) Add a description of your event"
			/>
			<span className="mb-2 text-secondary">
				{state?.errors?.fieldErrors.description?.join(" ")}
			</span>

			<button
				className="btn btn-primary w-full"
				disabled={isPending || anchor === "plan-food"}
				type="submit"
			>
				Next
			</button>
		</form>
	);
};

export default PlanEventForm;
