import { useEffect, useState } from "react";
import {
	UseFieldArrayRemove,
	UseFormRegister,
	UseFormSetValue,
} from "react-hook-form";
import {
	FormInput,
	MAX_DISH_SLOTS,
} from "@/app/start/plan-food/plan-food-manager";
import QuantityInput from "@/components/quantity-input";

interface CourseInputProps {
	fieldCount: number;
	index: number;
	register: UseFormRegister<FormInput>;
	remove: UseFieldArrayRemove;
	setValue: UseFormSetValue<FormInput>;
}

const CourseInput = ({
	fieldCount,
	index,
	register,
	remove,
	setValue,
}: CourseInputProps) => {
	const [count, setCount] = useState<number>(1);

	useEffect(() => {
		setValue(`slots.${index}.count`, count);
	}, [count, setValue, index]);

	const removeSlot = () => {
		remove(index);
	};

	return (
		<div className="flex w-full items-center justify-between">
			{fieldCount > 2 && (
				<button
					onClick={removeSlot}
					className="btn btn-circle btn-ghost btn-sm absolute -ml-10"
					type="button"
				>
					✕
				</button>
			)}

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

			<QuantityInput
				index={index}
				labelText="Signups Needed"
				max={MAX_DISH_SLOTS}
				min={1}
				quantity={count}
				setQuantity={setCount}
			/>
		</div>
	);
};

export default CourseInput;
