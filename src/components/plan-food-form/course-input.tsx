import { useRef } from "react";

type Props = {
	change: (index: number, value: string, count: string) => void;
	count: string;
	id: string;
	index: number;
	name: string;
	remove: (index: number, id: string) => void;
};

const CourseInput = ({ change, count, id, index, name, remove }: Props) => {
	const nameRef = useRef<HTMLInputElement>(null);
	const countRef = useRef<HTMLInputElement>(null);

	return (
		<>
			<div className="flex w-full items-center justify-between">
				<button
					onClick={() => remove(index, id)}
					className="btn btn-circle btn-ghost btn-sm"
					type="button"
				>
					✕
				</button>
				<div className="form-control w-2/3">
					<label className="label label-text" htmlFor={`name-${index}`}>
						What&apos;s Needed
					</label>
					<input
						className="input-text input input-bordered"
						id={`name-${index}`}
						maxLength={256}
						minLength={1}
						name={`name-${index}`}
						onChange={(e) =>
							change(index, e.target.value, countRef.current?.value ?? "0")
						}
						ref={nameRef}
						required
						type="text"
						value={name}
					/>
				</div>
				<div className="form-control">
					<label className="label label-text" htmlFor={`quantity-${index}`}>
						Signups Needed
					</label>
					<div className="join">
						<button
							className="btn join-item"
							onClick={() => {
								countRef.current?.stepDown();
								change(
									index,
									nameRef.current?.value ?? "",
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
							id={`quantity-${index}`}
							inputMode="numeric"
							max="99"
							min="0"
							name={`quantity-${index}`}
							onChange={(e) =>
								change(index, nameRef.current?.value ?? "", e.target.value)
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
									nameRef.current?.value ?? "",
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
			</div>
			<div className="divider mt-6" />
		</>
	);
};

export default CourseInput;
