"use client";

import { useSession } from "next-auth/react";
import { useActionState } from "react";
import submitAction, { RsvpFormState } from "@/components/rsvp-form/submit-actions";

type Props = {
	code: string;
};

const RsvpForm = ({ code }: Props) => {
	const session = useSession();

	const [, submit, isPending] = useActionState<RsvpFormState, FormData>(submitAction, {
		code,
		id: session?.data?.user?.id ?? "",
		success: false,
	});

	return (
		<form action={submit} className="form-control max-w-fit gap-2">
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

			<div>
				<label className="label label-text">Notes</label>
				<input
					className="input input-bordered w-full max-w-xs"
					maxLength={256}
					type="text"
				/>
			</div>
		</form>
	);
};

export default RsvpForm;
