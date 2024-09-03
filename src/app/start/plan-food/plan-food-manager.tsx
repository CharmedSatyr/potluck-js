"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import createFoodPlan from "@/actions/db/create-food-plan";
import { CustomizableFoodPlanValues } from "@/db/schema/food-plan";
import CourseInput from "@/app/start/plan-food/course-input";

export const MAX_DISH_SLOTS = 20;

export interface FormInput {
	slots: CustomizableFoodPlanValues[];
}

const PlanFoodManager = () => {
	const [mounted, setMounted] = useState<boolean>(false);
	useEffect(() => {
		if (!mounted) {
			setMounted(true);
		}
	}, []);

	const { push, replace } = useRouter();
	const searchParams = useSearchParams();

	const {
		control,
		formState: { isDirty, isValid },
		handleSubmit,
		register,
		setValue,
		reset,
	} = useForm<FormInput>();
	const { fields, append, remove } = useFieldArray({
		control,
		name: "slots",
	});

	useEffect(() => {
		console.log("Testing if this runs twice...");
		if (mounted) {
			append({ course: "", count: 1 });
		}

		() => reset();
	}, [mounted]);

	const shortId = searchParams.get("event");

	if (!shortId) {
		replace(`/start`);
		return null;
	}

	const goToNextPage = () => {
		push(`/party/${shortId}`);
	};

	const onSubmit = async (data: FormInput) => {
		try {
			await createFoodPlan({ ...data, shortId });

			goToNextPage();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<form
			className="form-control w-full lg:w-5/6 xl:w-2/3 2xl:w-1/2"
			onSubmit={handleSubmit(onSubmit)}
		>
			<h1>Plan the Food</h1>

			<h2>Create Your Slots</h2>

			{fields.map((field, index) => (
				<div key={field.id}>
					<CourseInput
						index={index}
						register={register}
						remove={remove}
						setValue={setValue}
					/>
					<div className="divider mt-6" />
				</div>
			))}

			<div className="flex justify-between">
				<button
					disabled={fields.length >= MAX_DISH_SLOTS}
					onClick={() => {
						if (fields.length >= MAX_DISH_SLOTS) {
							return;
						}

						append({ course: "", count: 1 });
					}}
					className="btn btn-secondary w-1/4"
				>
					{fields.length < MAX_DISH_SLOTS ? "Add Slot" : "Limit Reached"}
				</button>

				<button onClick={goToNextPage} className="btn btn-accent w-1/4">
					Skip For Now
				</button>
			</div>

			<input
				className="btn btn-primary my-8"
				type="submit"
				disabled={!isDirty || !isValid}
			/>
		</form>
	);
};

export default PlanFoodManager;
