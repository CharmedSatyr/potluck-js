"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
	useFieldArray,
	useForm,
	UseFormRegister,
	UseFormSetValue,
} from "react-hook-form";
import createFoodPlan from "@/actions/db/create-food-plan";
import { CustomizableFoodPlanValues } from "@/db/schema/food-plan";
import { useSession } from "next-auth/react";
import signInWithDiscord from "@/actions/auth/sign-in-with-discord";
import CourseInput from "@/app/start/plan-food/course-input";

const MAX_DISH_SLOTS = 20;

interface FormInput {
	slots: CustomizableFoodPlanValues[];
}

const PlanFoodManager = () => {
	const [mounted, setMounted] = useState<boolean>(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) {
			return;
		}
		append({ course: "", count: 1 });
	}, [mounted]);

	const { status } = useSession();
	const loggedIn = status === "authenticated";
	const { push, replace } = useRouter();
	const searchParams = useSearchParams();
	const {
		control,
		formState: { isDirty, isValid, errors },
		handleSubmit,
		register,
		setValue,
	} = useForm<FormInput>();
	const { fields, append, remove } = useFieldArray({
		control,
		name: "slots",
	});

	const shortId = searchParams.get("event");

	if (!shortId) {
		replace(`/start`);
		return null;
	}

	if (!mounted) {
		return <span className="loading loading-ring loading-lg"></span>;
	}

	const onSubmit = async (data: FormInput) => {
		console.log(data);

		if (!loggedIn) {
			await signInWithDiscord();

			return;
		}

		try {
			// TODO
			//const plan = {}
			//await createFoodPlan(plan);

			push(`/party/${shortId}`);
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
						key={field.id}
						register={register}
						index={index}
						remove={remove}
						setValue={setValue}
					/>
					<span className="text-secondary">
						{/*errors[`slots.${index}.course`]?.message*/}
					</span>
					<div className="divider mt-6" />
				</div>
			))}

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

			<input
				className="btn btn-primary my-8"
				type="submit"
				disabled={!isDirty || !isValid}
			/>
		</form>
	);
};

export default PlanFoodManager;
