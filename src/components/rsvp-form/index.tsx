"use client";

import { useSession } from "next-auth/react";
import { useActionState, useEffect, useState } from "react";
import submitAction, {
	RsvpFormState,
} from "@/components/rsvp-form/submit-actions";
import { Rsvp } from "@/db/schema/rsvp";

type Props = {
	code: string;
	currentResponse: Rsvp["response"] | null;
};

const RsvpForm = ({ code, currentResponse }: Props) => {
	const session = useSession();
	const [override, setOverride] = useState<boolean>(false);

	const [state, submit, isPending] = useActionState<RsvpFormState, FormData>(
		submitAction,
		{
			code,
			fields: { message: "" },
			id: session?.data?.user?.id ?? "",
			message: "",
			success: false,
		}
	);

	useEffect(() => {
		setOverride(false);
	}, [currentResponse, isPending, setOverride]);

	if (currentResponse !== null && !override) {
		return (
			<div className="mb-2 flex flex-col items-center">
				<p>You will {currentResponse === "yes" ? "" : "not"} attend.</p>
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
		<form action={submit} className="form-control max-w-fit gap-2">
			<h3>Will you attend?</h3>

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
				<label className="label label-text">Notes</label>
				<input
					className="input input-bordered w-full max-w-xs"
					defaultValue={state.fields.message}
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
