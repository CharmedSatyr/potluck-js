import { useRef } from "react";

type Props = {
	hasCommitments: boolean;
	id: string;
	index: number;
	remove: (index: number, id: string) => void;
};

const DeleteSlotButton = ({ hasCommitments, id, index, remove }: Props) => {
	const dialogRef = useRef<HTMLDialogElement>(null);

	if (!hasCommitments) {
		return (
			<button
				onClick={() => remove(index, id)}
				className="btn btn-circle btn-ghost btn-sm"
				type="button"
			>
				✕
			</button>
		);
	}

	return (
		<>
			<button
				className="btn btn-circle btn-ghost btn-sm"
				type="button"
				onClick={() => dialogRef.current?.showModal()}
			>
				✕
			</button>
			<dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
				<div className="modal-box">
					<h3 className="text-lg font-bold">Delete Slot Confirmation</h3>
					<p className="py-4">
						Some attendees have already signed up to bring this item. You’ll
						need to notify them directly if it’s no longer needed.
					</p>
					<div className="modal-action">
						<button
							aria-label="Cancel"
							className="btn"
							type="button"
							onClick={() => dialogRef.current?.close()}
						>
							Cancel
						</button>
						<button
							aria-label="Delete Slot"
							className="btn btn-secondary"
							type="button"
							onClick={() => {
								remove(index, id);
								dialogRef.current?.close();
							}}
						>
							Delete Slot
						</button>
					</div>
				</div>
			</dialog>
		</>
	);
};

export default DeleteSlotButton;
