import { useRef } from "react";

type Props = {
	change: (index: number, value: string) => void;
	index: number;
	remove: (index: number) => void;
	value: string;
};

const CourseInput = ({ index, change, remove, value }: Props) => {
	const quantityInputRef = useRef<HTMLInputElement>(null);

	return (
		<>
			<div className="flex w-full items-center justify-between">
				<button
					onClick={() => remove(index)}
					className="btn btn-circle btn-ghost btn-sm"
					type="button"
				>
					✕
				</button>
				<div className="form-control w-2/3">
					<label className="label label-text">What&apos;s Needed</label>
					<input
						className="input-text input input-bordered"
						maxLength={256}
						minLength={1}
						name={`name-${index}`}
						onChange={(e) => change(index, e.target.value)}
						type="text"
						value={value}
					/>
				</div>
				<div className="form-control">
					<label className="label label-text">Signups Needed</label>
					<div className="join">
						<button
							className="btn join-item"
							onClick={() => {
								quantityInputRef.current?.stepDown();
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
							defaultValue={0}
							id={`quantity-${index}`}
							inputMode="numeric"
							min="0"
							name={`quantity-${index}`}
							placeholder="0"
							ref={quantityInputRef}
							type="number"
						/>
						<button
							className="btn join-item"
							onClick={() => {
								quantityInputRef.current?.stepUp();
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
			</div>
			<div className="divider mt-6" />
		</>
	);
};

export default CourseInput;
