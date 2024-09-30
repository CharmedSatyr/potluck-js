import { useEffect, useState } from "react";
import {
	UseFieldArrayRemove,
	UseFormRegister,
	UseFormSetValue,
} from "react-hook-form";
import {
	FormInput,
	MAX_REQUESTS,
} from "@/app/start/[id]/plan-food/plan-food-manager";
import QuantityInput from "@/components/quantity-input";

type CourseInputProps = {
	index: number;
	multipleFields: boolean;
	register: UseFormRegister<FormInput>;
	remove: UseFieldArrayRemove;
	setValue: UseFormSetValue<FormInput>;
};

const CourseInput = ({
	index,
	multipleFields,
	register,
	remove,
	setValue,
}: CourseInputProps) => {
	const [count, setCount] = useState<number>(1);

	useEffect(() => {
		setValue(`requests.${index}.count` as const, count);
	}, [count, setValue, index]);

	const removeRequest = () => {
		remove(index);
	};

	return (
		<div className="flex w-full items-center justify-between">
			{multipleFields && (
				<button
					onClick={removeRequest}
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
					{...register(`requests.${index}.course` as const, {
						maxLength: 256,
						required: "Request name required",
					})}
				/>
			</div>

			<QuantityInput
				index={index}
				labelText="Signups Needed"
				max={MAX_REQUESTS}
				min={1}
				quantity={count}
				setQuantity={setCount}
			/>
		</div>
	);
};

export default CourseInput;
