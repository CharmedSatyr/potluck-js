import { useEffect, useState } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

type Slot = { course: string; count: number };

interface FormValues {
	slots: Slot[];
}

interface CourseInputProps {
	index: number;
	register: UseFormRegister<FormValues>;
	remove: any;
	setValue: UseFormSetValue<FormValues>;
}

const MAX_DISH_SLOTS = 20;

const CourseInput = ({
	register,
	setValue,
	index,
	remove,
}: CourseInputProps) => {
	const [count, setCount] = useState<number>(1);

	useEffect(() => {
		setValue(`slots.${index}.count`, count);
	}, [count, setValue, index]);

	const removeSlot = () => {
		remove(`slots.${index}`);
	};

	return (
		<div className="flex w-full items-center justify-between">
			<button
				onClick={removeSlot}
				className="btn btn-circle btn-ghost btn-sm absolute -ml-10"
				type="button"
			>
				✕
			</button>
			<div className="form-control w-2/3">
				<label htmlFor={`dish-name-${index}`} className="label label-text">
					What&apos;s Needed
				</label>
				<input
					className="input-text input input-bordered"
					id={`dish-name-${index}`}
					type="text"
					{...register(`slots.${index}.course`, {
						maxLength: 256,
						required: "Slot name required",
					})}
				/>
			</div>

			<div className="form-control items-end">
				<label htmlFor={`quantity-input-${index}`} className="label label-text">
					Signups Needed
				</label>
				<div className="join">
					<button
						onClick={() => setCount(count > 1 ? count - 1 : 1)}
						type="button"
						className="btn join-item input-bordered"
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
						type="text"
						className="input join-item input-bordered w-14"
						id={`quantity-input-${index}`}
						value={count}
						readOnly
					/>

					<button
						onClick={() =>
							setCount(count < MAX_DISH_SLOTS ? count + 1 : MAX_DISH_SLOTS)
						}
						type="button"
						className="btn join-item input-bordered"
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
	);
};

export default CourseInput;
