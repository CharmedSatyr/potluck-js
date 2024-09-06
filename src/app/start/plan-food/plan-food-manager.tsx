"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import createRequest from "@/actions/db/create-request";
import { CustomizableRequestValues } from "@/db/schema/request";
import CourseInput from "@/app/start/plan-food/course-input";

export const MAX_DISH_SLOTS = 20;

export interface FormInput {
	slots: CustomizableRequestValues[];
}

const PlanFoodManager = () => {
	const [mounted, setMounted] = useState<boolean>(false);
	useEffect(() => {
		if (!mounted) {
			setMounted(true);
		}
	}, [mounted]);

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
		if (!mounted || fields.length > 0) {
			return;
		}

		append({ course: "", count: 1 });

		return () => reset();
	}, [append, mounted, fields.length, reset]);

	const shortId = searchParams.get("event");

	if (!shortId) {
		replace(`/start`);
		return null;
	}

	const goToNextPage = () => {
		push(`/event/${shortId}`);
	};

	const onSubmit = async (data: FormInput) => {
		try {
			await createRequest({ ...data, shortId });

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
						multipleFields={fields.length > 1}
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
