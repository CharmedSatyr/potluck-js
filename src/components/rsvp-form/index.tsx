"use client";

import { use, useActionState, useEffect, useState } from "react";
import submitAction, {
	RsvpFormState,
} from "@/components/rsvp-form/submit-actions";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

type Props = {
	code: string;
	currentRsvpPromise: Promise<{ response: "yes" | "no" }[]>;
};

const RsvpForm = ({ code, currentRsvpPromise }: Props) => {
	const [currentRsvp] = use(currentRsvpPromise);

	const [override, setOverride] = useState<boolean>(false);

	const [state, submit, isPending] = useActionState<RsvpFormState, FormData>(
		submitAction,
		{
			code,
			fields: { message: "" },
			message: "",
			success: false,
		}
	);

	useEffect(() => {
		setOverride(false);
	}, [currentRsvp, isPending, setOverride]);

	if (currentRsvp?.response && !override) {
		return (
			<div className="w-full text-center md:float-right md:max-w-40">
				<p className="flex w-full items-center justify-center gap-1">
					<CheckCircleIcon className="size-6 text-success" /> You will{" "}
					{currentRsvp.response === "yes" ? "" : "not"} attend.
				</p>
				<button
					className="btn btn-accent w-full"
					disabled={isPending}
					type="button"
					onClick={() => {
						setOverride(true);
					}}
				>
					Change RSVP
				</button>
			</div>
		);
	}

	return (
		<form
			action={submit}
			className="form-control w-full gap-2 text-center md:float-right md:max-w-40"
		>
			<h3 className="mt-0">Will you attend?</h3>

			<button
				className="btn btn-primary w-full"
				data-response="yes"
				disabled={isPending}
				name="response"
				type="submit"
				value="yes"
			>
				Accept
			</button>

			<button
				className="btn btn-secondary w-full"
				data-response="no"
				disabled={isPending}
				name="response"
				type="submit"
				value="no"
			>
				Decline
			</button>

			<div className="form-control">
				<label className="label label-text" htmlFor="rsvp-message">
					Notes
				</label>
				<input
					className="input input-bordered w-full md:max-w-xs"
					defaultValue={state.fields.message}
					id="rsvp-message"
					maxLength={256}
					name="message"
					type="text"
				/>
				<span className="text-error">{state.message}</span>
			</div>
		</form>
	);
};

export default RsvpForm;

export const RsvpFormFallback = () => {
	return (
		<div className="mt-4 flex w-full flex-col gap-4 md:float-right md:max-w-40">
			<div className="skeleton h-10 w-full" />
			<div className="skeleton h-8 w-full" />
			<div className="skeleton h-8 w-full" />
			<div className="skeleton h-8 w-full" />
		</div>
	);
};
