"use client";

import { useRef } from "react";

type Props = {
	code: string;
	remove: ({ code }: { code: string }) => Promise<void>;
};

const DeleteEventButton = ({ code, remove }: Props) => {
	const dialogRef = useRef<HTMLDialogElement>(null);

	return (
		<>
			<button
				className="btn btn-error btn-xs md:btn-sm"
				type="button"
				onClick={() => dialogRef.current?.showModal()}
			>
				Delete
			</button>
			<dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
				<div className="modal-box">
					<h3 className="text-lg font-bold">Delete Event Confirmation</h3>
					<p className="py-4">
						Are you sure you want to delete this event? This action cannot be
						undone.
					</p>
					<div className="modal-action">
						<button
							aria-label="Cancel"
							className="btn btn-sm"
							type="button"
							onClick={() => dialogRef.current?.close()}
						>
							Cancel
						</button>
						<button
							aria-label="Delete Slot"
							className="btn btn-error btn-sm"
							type="button"
							onClick={() => {
								remove({ code });
								dialogRef.current?.close();
							}}
						>
							Delete Event
						</button>
					</div>
				</div>
			</dialog>
		</>
	);
};

export default DeleteEventButton;
