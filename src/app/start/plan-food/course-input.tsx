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
	index: number;
	multipleFields: boolean;
	register: UseFormRegister<FormInput>;
	remove: UseFieldArrayRemove;
	setValue: UseFormSetValue<FormInput>;
}

const CourseInput = ({
	index,
	multipleFields,
	register,
	remove,
	setValue,
}: CourseInputProps) => {
	const [count, setCount] = useState<number>(1);

	useEffect(() => {
		setValue(`slots.${index}.count` as const, count);
	}, [count, setValue, index]);

	const removeSlot = () => {
		remove(index);
	};

	return (
		<div className="flex w-full items-center justify-between">
			{multipleFields && (
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
					{...register(`slots.${index}.course` as const, {
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
