"use client";

import { use, useActionState, useEffect, useState } from "react";
import submitAction, {
	RsvpFormState,
} from "@/components/rsvp-form/submit-actions";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import LoadingIndicator from "@/components/loading-indicator";
import WarningAlert from "@/components/warning-alert";

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
	}, [currentRsvp, setOverride]);

	if (currentRsvp?.response && !override && !isPending) {
		return (
			<div className="w-full text-center md:float-right md:max-w-40">
				<p className="flex w-full items-center justify-center gap-1 text-nowrap">
					{currentRsvp.response === "yes" ? (
						<>
							<CheckCircleIcon className="size-6 text-success" /> You will
							attend.
						</>
					) : (
						<>
							<XCircleIcon className="size-6 text-error" /> You won&apos;t
							attend.
						</>
					)}
				</p>
				<button
					className="btn btn-accent w-full"
					disabled={isPending}
					type="button"
					onClick={() => {
						setOverride(true);
					}}
				>
					{isPending ? <LoadingIndicator size={6} /> : "Change RSVP"}
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
				{isPending ? <LoadingIndicator size={6} /> : "Accept"}
			</button>

			<button
				className="btn btn-secondary w-full"
				data-response="no"
				disabled={isPending}
				name="response"
				type="submit"
				value="no"
			>
				{isPending ? <LoadingIndicator size={6} /> : "Decline"}
			</button>

			<div className="form-control">
				<label className="label label-text" htmlFor="rsvp-message">
					Notes
				</label>
				<input
					className="input input-bordered w-full md:max-w-xs"
					defaultValue={state.fields.message}
					disabled={isPending}
					id="rsvp-message"
					maxLength={256}
					name="message"
					type="text"
				/>
				<WarningAlert text={state.message} />
			</div>
		</form>
	);
};

export default RsvpForm;

export const RsvpFormFallback = () => {
	return (
		<div className="flex w-full flex-col gap-4 md:float-right md:max-w-40">
			<div className="skeleton h-12 w-full" />
			<div className="skeleton h-12 w-full" />
			<div className="skeleton h-12 w-full" />
		</div>
	);
};
