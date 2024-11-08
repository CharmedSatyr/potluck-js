"use client";

import Form from "next/form";
import { useActionState, useEffect, useMemo, useState } from "react";
import CourseInput from "@/components/plan-food-form/course-input";
import { MAX_REQUESTS } from "@/constants";
import submitRequest, {
	PlanFoodFormState,
} from "@/components/plan-food-form/submit-actions";
import { useSearchParams } from "next/navigation";
import useAnchor from "@/hooks/use-anchor";
import Link from "next/link";
import { z } from "zod";

const courseSchema = z.strictObject({
	count: z.coerce.number().positive(),
	name: z.string().trim().min(1),
});

const PlanFoodForm = () => {
	const [anchor] = useAnchor();
	const params = useSearchParams();

	const [state, submit, isPending] = useActionState<
		PlanFoodFormState,
		FormData
	>(submitRequest, {
		code: "",
		fields: {},
		message: "",
		success: false,
	});

	useEffect(() => {
		const code = params.get("code");
		if (!code) {
			return;
		}

		state.code = code;
	}, [anchor, params, state]);

	const [courses, setCourses] = useState([{ name: "", count: "0" }]);

	const addCourse = () => {
		if (courses.length >= MAX_REQUESTS) {
			return;
		}

		setCourses([...courses, { name: "", count: "0" }]);
	};

	const removeCourse = (index: number) => {
		setCourses(courses.filter((_, i) => i !== index));
	};

	const handleCourseChange = (index: number, name: string, count: string) => {
		const updatedCourses = [...courses];
		updatedCourses[index].name = name;
		updatedCourses[index].count = count;

		setCourses(updatedCourses);
	};

	const coursesValid = useMemo(
		() => courses.every((course) => courseSchema.safeParse(course).success),
		[courses]
	);

	return (
		<Form
			action={submit}
			className="form-control w-full lg:w-5/6 xl:w-2/3 2xl:w-1/2"
		>
			<h1 className="my-0 text-6xl font-extrabold text-primary">
				Plan the Food
			</h1>
			<h2>Create Your Requests</h2>

			{courses.map((course, index) => (
				<CourseInput
					key={`${index}-course`}
					change={handleCourseChange}
					index={index}
					remove={removeCourse}
					value={course.name}
				/>
			))}

			<div className="mb-4 flex justify-between">
				<button
					className="btn btn-secondary w-1/3"
					onClick={addCourse}
					type="button"
				>
					Add Request
				</button>
				<Link className="btn btn-accent w-1/3" href={`/event/${state.code}`}>
					Skip for Now
				</Link>
			</div>

			<button
				className="btn btn-primary w-full"
				disabled={isPending || !coursesValid}
				type="submit"
			>
				Submit and Continue
			</button>
		</Form>
	);
};

export default PlanFoodForm;
