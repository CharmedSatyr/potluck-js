import Form from "next/form";
import { useActionState, useState } from "react";
import { submitPlan } from "../manage-event-wizard/actions";
import CourseInput from "./course-input";
import { MAX_REQUESTS } from "@/app/start/[code]/plan-food/plan-food-manager";

const PlanFoodForm = () => {
	const [state, submitAction, isPending] = useActionState(submitPlan, {
		success: false,
	});
	const [courses, setCourses] = useState([{ value: "" }]);

	const addCourse = () => {
		if (courses.length >= MAX_REQUESTS) {
			return;
		}

		setCourses([...courses, { value: "" }]);
	};

	const removeCourse = (index: number) => {
		setCourses(courses.filter((_, i) => i !== index));
	};

	const handleCourseChange = (index: number, value: string) => {
		const updatedCourses = [...courses];
		updatedCourses[index].value = value;
		setCourses(updatedCourses);
	};

	return (
		<Form
			action={submitAction}
			className="form-control w-full lg:w-5/6 xl:w-2/3 2xl:w-1/2"
		>
			<h1 className="my-0 text-6xl font-extrabold text-primary">
				Plan the Food
			</h1>
			<h2>Create Your Requests</h2>

			{courses.map((course, index) => (
				<CourseInput
					key={`${index}-${course.value}`}
					change={handleCourseChange}
					remove={removeCourse}
					index={index}
					value={course.value}
				/>
			))}

			<button
				className="btn btn-secondary mb-2 w-full"
				onClick={addCourse}
				type="button"
			>
				Add Request
			</button>
			<button
				className="btn btn-primary w-full"
				disabled={isPending}
				type="submit"
			>
				Submit and Continue
			</button>
		</Form>
	);
};

export default PlanFoodForm;
