"use client";

import _ from "lodash";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useSession } from "next-auth/react";
import { CustomizableEventValues } from "@/db/schema/event";
import formatIsoTime from "@/utilities/format-iso-time";

interface CustomizeEventSkeletonProps {
	code?: string;
	errors: FieldErrors<Partial<CustomizableEventValues>>;
	onSubmit: React.FormEventHandler<HTMLFormElement>;
	register: UseFormRegister<CustomizableEventValues>;
}

const TitleManagement = ({ code }: { code?: string }) => {
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

export const CustomizeEventSkeleton = ({
	code,
	errors,
	onSubmit,
	register,
}: CustomizeEventSkeletonProps) => {
	const { data: authData, status } = useSession();
	const loggedIn = status === "authenticated";

	const username = authData?.user?.name;

	return (
		<form className="form-control w-full" onSubmit={onSubmit}>
			<TitleManagement code={code} />

			<input
				className={`-mt-2 w-full border-b-2 border-base-100 bg-inherit text-6xl font-extrabold text-primary focus:border-neutral focus:outline-none ${errors.name && "input-secondary border"}`}
				placeholder="Untitled Event"
				type="text"
				{...register("name", {
					required: "Event name is required",
					maxLength: 256,
				})}
			/>
			<span className="mb-2 text-secondary">{errors.name?.message}</span>

			<div className="my-1 flex flex-col">
				<div className="flex items-center justify-between">
					<input
						className="border-base-100 bg-inherit text-2xl focus:border-b-2 focus:border-neutral focus:outline-none"
						type="date"
						{...register("startDate", {
							required: "Date is required",
						})}
					/>{" "}
					<span className="text-2xl font-bold"> at </span>
					<input
						className="w-4/12 border-b-2 border-base-100 bg-inherit text-2xl focus:border-neutral focus:outline-none"
						step={60}
						type="time"
						{...register("startTime", {
							required: "Time is required",
							setValueAs: formatIsoTime,
						})}
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
					{...register("location", {
						required: "Location is required",
						maxLength: 256,
					})}
				/>
				<span className="text-secondary">{errors.location?.message}</span>
			</div>

			<div className="flex flex-col">
				<div className="flex items-center justify-between">
					<span className="-mr-5 w-3/12 text-xl font-bold">Hosted by</span>{" "}
					<input
						className="w-8/12 border-b-2 border-base-100 bg-inherit text-xl focus:border-neutral focus:outline-none"
						placeholder={username ? "(optional) Nickname" : "Nickname"}
						type="text"
						{...register("hosts", {
							maxLength: 256,
							required: username ? false : "Host name is required",
						})}
					/>
				</div>
				<span className="mb-2 text-secondary">{errors.hosts?.message}</span>
			</div>

			<input
				className="my-2 w-full border-b-2 border-base-100 bg-inherit focus:border-neutral focus:outline-none"
				placeholder="(optional) Add a description of your event"
				{...register("description", {
					maxLength: 256,
				})}
			/>

			{!code && (
				<input
					className="btn btn-primary my-2 w-full"
					type="submit"
					value={loggedIn ? "Continue" : "Sign in to Continue"}
				/>
			)}
		</form>
	);
};

export default CustomizeEventSkeleton;
