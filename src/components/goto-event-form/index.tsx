"use client";

import { useActionState } from "react";
import findEventExistsRedirect from "@/components/goto-event-form/find-event-exists-redirect";
import { EVENT_CODE_LENGTH } from "@/db/schema/event";

export type GotoEventFormState = {
	code: string;
	message: string;
	success: boolean;
};

const GotoEventForm = () => {
	const [state, formAction, isPending] = useActionState<
		GotoEventFormState,
		FormData
	>(findEventExistsRedirect, {
		code: "",
		message: "",
		success: false,
	});

	return (
		<form className="form-control" action={formAction}>
			<button
				disabled={isPending}
				className="btn btn-secondary mb-2 text-2xl"
				type="submit"
			>
				Find an Event
			</button>
			<input
				className="input input-bordered w-full"
				defaultValue={state?.code ? state.code : undefined}
				minLength={EVENT_CODE_LENGTH}
				maxLength={EVENT_CODE_LENGTH}
				name="code"
				placeholder="238JK"
			/>
			<output aria-live="polite">{state?.message}</output>
		</form>
	);
};

export default GotoEventForm;
