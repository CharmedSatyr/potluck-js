import { useRef } from "react";
import DeleteSlotButton from "./delete-slot-button";

type Props = {
	change: (index: number, value: string, count: string) => void;
	count: string;
	hasCommitments: boolean;
	id: string;
	index: number;
	item: string;
	remove: (index: number, id: string) => void;
};

const CourseInput = ({
	change,
	count,
	hasCommitments,
	id,
	index,
	item,
	remove,
}: Props) => {
	const itemRef = useRef<HTMLInputElement>(null);
	const countRef = useRef<HTMLInputElement>(null);

	return (
		<div className="flex w-full items-center justify-between">
			<DeleteSlotButton
				hasCommitments={hasCommitments}
				id={id}
				index={index}
				remove={remove}
			/>
			<div className="form-control w-2/3">
				<label className="label label-text" htmlFor={`item-${index}`}>
					What&apos;s Needed
				</label>
				<input
					className="input-text input input-bordered"
					id={`item-${index}`}
					maxLength={256}
					minLength={1}
					name={`item-${index}`}
					onChange={(e) =>
						change(index, e.target.value, countRef.current?.value ?? "0")
					}
					ref={itemRef}
					required
					type="text"
					value={item}
				/>
			</div>
			<div className="form-control">
				<label className="label label-text" htmlFor={`count-${index}`}>
					Signups Needed
				</label>
				<div className="join">
					<button
						className="btn join-item"
						onClick={() => {
							countRef.current?.stepDown();
							change(
								index,
								itemRef.current?.value ?? "",
								countRef.current?.value ?? "0"
							);
						}}
						type="button"
					>
						<svg
							className="h-3 w-3 text-gray-900 dark:text-white"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 18 2"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M1 1h16"
							/>
						</svg>
					</button>
					<input
						className="input join-item input-bordered max-w-20"
						defaultValue={count}
						id={`count-${index}`}
						inputMode="numeric"
						max="99"
						min="0"
						name={`count-${index}`}
						onChange={(e) =>
							change(index, itemRef.current?.value ?? "", e.target.value)
						}
						ref={countRef}
						required
						type="number"
					/>
					<button
						className="btn join-item"
						onClick={() => {
							countRef.current?.stepUp();
							change(
								index,
								itemRef.current?.value ?? "",
								countRef.current?.value ?? "0"
							);
						}}
						type="button"
					>
						<svg
							className="h-3 w-3 text-gray-900 dark:text-white"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 18 18"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M9 1v16M1 9h16"
							/>
						</svg>
					</button>
				</div>
			</div>
			<input
				className="hidden"
				defaultValue={id}
				name={`id-${index}`}
				required
				type="text"
			/>
		</div>
	);
};

export default CourseInput;
