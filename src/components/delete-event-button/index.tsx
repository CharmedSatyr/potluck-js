"use client";

import { useActionState, useEffect, useRef } from "react";
import deleteEventAction from "@/components/delete-event-button/delete-event-action";
import Form from "next/form";
import LoadingIndicator from "../loading-indicator";
import { DeleteEventState } from "./delete-event-action.types";

type Props = {
	className?: string;
	code: string;
	redirect: boolean;
};

const DeleteEventForm = ({ className, code, redirect }: Props) => {
	const dialogRef = useRef<HTMLDialogElement>(null);

	const [state, submit, isPending] = useActionState<DeleteEventState, FormData>(
		deleteEventAction,
		{
			code,
			redirect,
			success: false,
		}
	);

	useEffect(() => {
		if (!dialogRef.current?.open) {
			return;
		}

		if (!state.success) {
			return;
		}

		dialogRef.current.close();
	}, [state.success]);

	return (
		<Form action={submit}>
			<button
				className={`btn btn-error w-full md:float-right md:w-28 ${className}`}
				disabled={dialogRef.current?.open}
				type="button"
				onClick={() => dialogRef.current?.showModal()}
			>
				{isPending ? <LoadingIndicator size={8} /> : "Delete"}
			</button>
			<dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
				<div className="modal-box">
					<h3 className="text-lg font-bold">Delete Event Confirmation</h3>
					<p className="py-4">
						Are you sure you want to delete this event? This action cannot be
						undone.
					</p>
					<p>You are responsible for communicating any changes to attendees.</p>
					<div className="modal-action">
						<button
							aria-label="Cancel"
							className="btn btn-sm"
							disabled={isPending}
							type="button"
							onClick={() => dialogRef.current?.close()}
						>
							Cancel
						</button>
						<button
							aria-label="Delete Slot"
							className="btn btn-error btn-sm"
							disabled={isPending}
							type="submit"
						>
							{isPending ? <LoadingIndicator size={8} /> : "Delete"}
						</button>
					</div>
				</div>
			</dialog>
		</Form>
	);
};

export default DeleteEventForm;
