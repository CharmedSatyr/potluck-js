"use client";

import { useSession } from "next-auth/react";
import { useActionState } from "react";
import submitAction, {
	RsvpFormState,
} from "@/components/rsvp-form/submit-actions";

type Props = {
	code: string;
};

const RsvpForm = ({ code }: Props) => {
	const session = useSession();

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
