"use client";

import { RefObject, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useSession } from "next-auth/react";
import { CreateEventFormData } from "@/app/start/create-event/submit-actions.types";

const Title = ({ code }: { code?: string }) => {
	if (!code) {
		return <h1>Create an Event</h1>;
	}

	return (
		<div className="flex justify-between">
			<h1>
				Event Code: <span className="text-secondary">{code}</span>
			</h1>
			<input className="btn btn-primary w-36" type="submit" value="Save" />
		</div>
	);
};

const SubmitButton = ({ disabled }: { disabled: boolean }) => {
	const session = useSession();
	const loggedIn = session.status === "authenticated";

	return (
		<input
			className="btn btn-primary my-2 w-full"
			disabled={disabled}
			type="submit"
			value={loggedIn ? "Continue" : "Sign in to Continue"}
		/>
	);
};

type Props = {
	code?: string;
	form: UseFormReturn<CreateEventFormData>;
	loading: boolean;
	ref: RefObject<HTMLFormElement>;
	submitAction: (formData: FormData) => void;
};

export const CustomizeEventSkeleton = ({
	code,
	form,
	loading,
	ref,
	submitAction,
}: Props) => {
	const {
		formState: { errors, isSubmitSuccessful },
		handleSubmit,
		register,
	} = form;

	useEffect(() => {
		// Submit programmatically once useForm internal state is updated to success.
		if (!isSubmitSuccessful) {
			return;
		}

		ref.current?.submit();
	}, [isSubmitSuccessful]);

	return (
		<form
			ref={ref}
			className="form-control w-full"
			action={submitAction}
			// Validate with handleSubmit; perform no-op; call handleSubmit's return fn with e to update useForm state.
			onSubmit={handleSubmit(() => {})}
		>
			<Title code={code} />

			<input
				className={`-mt-2 w-full border-b-2 border-base-100 bg-inherit text-6xl font-extrabold text-primary focus:border-neutral focus:outline-none ${errors.name && "input-secondary border"}`}
				placeholder="Untitled Event"
				type="text"
				{...register("name")}
			/>
			<span className="mb-2 text-secondary">{errors.name?.message}</span>

			<div className="my-1 flex flex-col">
				<div className="flex items-center justify-between">
					<input
						className="border-base-100 bg-inherit text-2xl focus:border-b-2 focus:border-neutral focus:outline-none"
						type="date"
						{...register("startDate")}
					/>{" "}
					<span className="text-2xl font-bold"> at </span>
					<input
						className="w-4/12 border-b-2 border-base-100 bg-inherit text-2xl focus:border-neutral focus:outline-none"
						step={60}
						type="time"
						{...register("startTime")}
					/>
				</div>
				<div>
					<span className="mt-0 text-secondary">
						{errors.startDate?.message}
					</span>
					<span className="float-right mb-2 mt-0 text-secondary">
						{errors.startTime?.message}
					</span>
				</div>
			</div>

			<div className="mb-4 mt-1">
				<input
					className="my-2 w-full border-b-2 border-base-100 bg-inherit text-2xl focus:border-neutral focus:outline-none"
					placeholder="Place name, address, or link"
					type="text"
					{...register("location")}
				/>
				<span className="text-secondary">{errors.location?.message}</span>
			</div>

			<div className="flex flex-col">
				<div className="flex items-center justify-between">
					<span className="-mr-5 w-3/12 text-xl font-bold">Hosted by</span>{" "}
					<input
						className="w-8/12 border-b-2 border-base-100 bg-inherit text-xl focus:border-neutral focus:outline-none"
						placeholder={"(optional) Nickname"}
						type="text"
						{...register("hosts")}
					/>
				</div>
				<span className="mb-2 text-secondary">{errors.hosts?.message}</span>
			</div>

			<input
				className="my-2 w-full border-b-2 border-base-100 bg-inherit focus:border-neutral focus:outline-none"
				placeholder="(optional) Add a description of your event"
				{...register("description")}
			/>

			{!code && <SubmitButton disabled={loading} />}
		</form>
	);
};

export default CustomizeEventSkeleton;
