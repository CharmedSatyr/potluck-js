"use client";

import Form from "next/form";
import {
	useActionState,
	useEffect,
	useMemo,
	useReducer,
	useState,
} from "react";
import CourseInput from "@/components/plan-food-form/course-input";
// TODO: Should this be passed in?
import submitSlots, {
	PlanFoodFormState,
} from "@/components/plan-food-form/submit-actions";
import { useSearchParams } from "next/navigation";
import useAnchor from "@/hooks/use-anchor";
import Link from "next/link";
import { z } from "zod";
// TODO: This isn't what's being used.
import { Slot } from "@/db/schema/slot";
// TODO: Should this be passed in?
import deleteSlot from "@/actions/db/delete-slot";

const MAX_SLOTS = 20;

const courseSchema = z.strictObject({
	id: z.string().uuid(),
	count: z.coerce.number().positive(),
	name: z.string().trim().min(1),
});

type Props = {
	code: string | null;
	slots: Slot[];
};

const PlanFoodForm = ({ code, slots }: Props) => {
	const [anchor] = useAnchor();
	const searchParams = useSearchParams();
	const [, forceUpdate] = useReducer((x) => x + 1, 0);

	// TODO: Add loading indicator when pending.
	const [state, submit, isPending] = useActionState<
		PlanFoodFormState,
		FormData
	>(submitSlots, {
		code: code ?? "",
		message: "",
		success: false,
	});

	useEffect(() => {
		if (!code || !state) {
			return;
		}

		state.code = code;

		forceUpdate();
	}, [code, state, searchParams]);

	/** TODO: Update this to work without JS. */
	const [courses, setCourses] = useState<
		{ item: string; count: string; id: string }[]
	>(() => {
		if (slots.length > 0) {
			return slots.map((slot) => ({
				item: slot.course,
				count: slot.count.toString(),
				id: slot.id,
			}));
		}

		return [{ item: "", count: "0", id: crypto.randomUUID() }];
	});

	const addCourse = () => {
		if (courses.length >= MAX_SLOTS) {
			return;
		}

		setCourses([...courses, { item: "", count: "0", id: crypto.randomUUID() }]);
	};

	const removeCourse = async (index: number, id: string) => {
		setCourses(courses.filter((_, i) => i !== index));
		await deleteSlot({ id });
	};

	const handleCourseChange = (index: number, item: string, count: string) => {
		const updatedCourses = [...courses];
		updatedCourses[index].item = item;
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
			<h2>Create Your Slots</h2>

			<span className="mb-2 text-secondary">{state.message}</span>
			{courses.map((course, index) => (
				<CourseInput
					change={handleCourseChange}
					count={course.count}
					id={course.id}
					index={index}
					item={course.item}
					key={course.id}
					remove={removeCourse}
				/>
			))}

			<div className="mb-4 flex justify-between">
				<button
					className="btn btn-secondary w-1/3"
					onClick={addCourse}
					type="button"
				>
					Add Slot
				</button>
				<Link
					className={`btn btn-accent w-1/3 ${state.code ? "" : "btn-disabled pointer-events-none"}`}
					href={`/event/${state.code}`}
				>
					Skip for Now
				</Link>
			</div>

			<button
				className="btn btn-primary w-full"
				disabled={isPending || !coursesValid || anchor === "create-event"}
				type="submit"
			>
				Submit and Continue
			</button>
		</Form>
	);
};

export default PlanFoodForm;
