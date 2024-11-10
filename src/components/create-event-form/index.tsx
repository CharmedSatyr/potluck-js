"use client";

import Form from "next/form";
import { useActionState, useCallback, useEffect, useState } from "react";
import {
	createEventAction,
	loginAction,
} from "@/components/create-event-form/submit-actions";
import useAnchor from "@/hooks/use-anchor";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
	CreateEventFormData,
	CreateEventFormState,
} from "@/components/create-event-form/submit-actions.types";

const DEV = process.env.NODE_ENV === 'development'

const CreateEventForm = () => {
	const path = usePathname();
	const session = useSession();
	const searchParams = useSearchParams();

	const [defaultValues] = useState<CreateEventFormData>(() => {
		const values: CreateEventFormData = {
			description: "",
			hosts: "",
			location: DEV ? "123 Main Street" : "",
			name: DEV ? "Test Event" : "",
			startDate: DEV ? "2025-01-09" : "",
			startTime: DEV ? "12:00" : "",
		};

		if (searchParams.get("source") !== "discord") {
			return values;
		}

		for (const key in values) {
			const searchValue = searchParams.get(key);
			if (!searchValue) {
				continue;
			}
			values[key as keyof CreateEventFormData] = searchValue;
		}

		return values;
	});

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);

			return params.toString();
		},
		[searchParams]
	);

	const submit =
		session.status === "authenticated" ? createEventAction : loginAction;

	const [, scrollToAnchor] = useAnchor();
	const [state, submitAction, isPending] = useActionState<
		CreateEventFormState,
		FormData
	>(submit, {
		fields: defaultValues,
		message: "",
		path,
		success: false,
	});

	useEffect(() => {
		if (isPending || !state.code || typeof window === "undefined") {
			return;
		}
		// TODO: Unbreak "back" navigation via button in wizard.
		// TODO: What should happen on refresh? It currently keeps existing hash to drop on this page, even if it's #plan-food

		const query = "?" + createQueryString("code", state.code);
		scrollToAnchor("plan-food", query);
	}, [createQueryString, state.code, isPending, scrollToAnchor]);

	return (
		<Form
			action={submitAction}
			className="flex max-h-96 flex-col justify-between"
		>
			<input
				className="w-full border-b-2 border-base-100 bg-inherit text-6xl font-extrabold text-primary focus:border-neutral focus:outline-none"
				defaultValue={state.fields.name}
				name="name"
				id="name"
				placeholder="Untitled Event"
				required
				type="text"
			/>
			<span className="mb-2 text-secondary">
				{state.errors?.fieldErrors.name?.join(" ")}
			</span>

			<div className="flex items-center justify-between">
				<input
					className="border-base-100 bg-inherit text-2xl focus:border-b-2 focus:border-neutral focus:outline-none"
					defaultValue={state.fields.startDate}
					name="startDate"
					type="date"
					required
				/>{" "}
				<span className="text-2xl font-bold"> at </span>
				<input
					className="w-4/12 border-b-2 border-base-100 bg-inherit text-2xl focus:border-neutral focus:outline-none"
					defaultValue={state.fields.startTime}
					name="startTime"
					step={60}
					required
					type="time"
				/>
			</div>
			<div>
				<span className="mt-0 text-secondary">
					{state.errors?.fieldErrors.startDate?.join(" ")}
				</span>
				<span className="float-right mb-2 mt-0 text-secondary">
					{state.errors?.fieldErrors.startTime?.join(" ")}
				</span>
			</div>

			<div className="mb-4 mt-1">
				<input
					className="my-2 w-full border-b-2 border-base-100 bg-inherit text-2xl focus:border-neutral focus:outline-none"
					defaultValue={state.fields.location}
					name="location"
					placeholder="Place name, address, or link"
					required
					type="text"
				/>
				<span className="mb-2 text-secondary">
					{state.errors?.fieldErrors.location?.join(" ")}
				</span>
			</div>

			<div className="flex flex-col">
				<div className="flex items-center justify-between">
					<span className="-mr-5 w-3/12 text-xl font-bold">Hosted by</span>{" "}
					<input
						className="w-8/12 border-b-2 border-base-100 bg-inherit text-xl focus:border-neutral focus:outline-none"
						defaultValue={state.fields.hosts}
						name="hosts"
						placeholder={"(optional) Nickname"}
						type="text"
					/>
				</div>
				<span className="mb-2 text-secondary">
					{state.errors?.fieldErrors.hosts?.join(" ")}
				</span>
			</div>

			<input
				className="my-2 w-full border-b-2 border-base-100 bg-inherit focus:border-neutral focus:outline-none"
				defaultValue={state.fields.description}
				name="description"
				placeholder="(optional) Add a description of your event"
			/>
			<span className="mb-2 text-secondary">
				{state.errors?.fieldErrors.description?.join(" ")}
			</span>

			<button
				className="btn btn-primary w-full"
				disabled={isPending}
				type="submit"
			>
				Next
			</button>
		</Form>
	);
};

export default CreateEventForm;
