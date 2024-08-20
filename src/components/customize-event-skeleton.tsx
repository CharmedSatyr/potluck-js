"use client";

import _ from "lodash";
import { UseFormRegister } from "react-hook-form";
import formatIsoTime from "@/utilities/format-iso-time";
import { useSession } from "next-auth/react";

interface CustomizeEventSkeletonProps {
	onSubmit: React.FormEventHandler<HTMLFormElement>;
	register: UseFormRegister<any>; // TODO: Clarify this type.
	shortId?: string;
}

const TitleManagement = ({ shortId }: { shortId?: string }) => {
	if (!shortId) {
		return <h1>Create an Event</h1>;
	}

	return <>
		<input className="btn btn-primary float-right" type="submit" value="Save" />
		<h1>
			Party Code: <span className="text-secondary">{shortId}</span>
		</h1>
	</>
}

export const CustomizeEventSkeleton = ({
	onSubmit,
	register,
	shortId,
}: CustomizeEventSkeletonProps) => {
	const { status } = useSession();
	const loggedIn = status === "authenticated";

	return (
		<form className="w-4/6" onSubmit={onSubmit}>
			<TitleManagement shortId={shortId} />

			<input
				className="-mt-1 mb-1 w-full text-6xl font-extrabold text-primary"
				placeholder="Untitled Event"
				type="text"
				{...register("name", {
					required: "This field is required",
					maxLength: 256,
				})}
			/>
			{/*<span className="mt-0 text-error">{errors.name?.message}</span>*/}

			<div className="my-1 flex justify-between">
				<input
					className="text-2xl font-bold"
					type="date"
					{...register("startDate", {
						required: "This field is required",
					})}
				/>{" "}
				<span className="text-2xl font-bold"> at </span>
				<input
					className="w-4/12 text-2xl font-bold"
					step={60}
					type="time"
					{...register("startTime", {
						required: "This field is required",
						setValueAs: formatIsoTime,
					})}
				/>
				{/*
					<span className="mt-0 text-error">{errors.startDate?.message}</span>
					<span className="float-right mt-0 text-error">
						{errors.startTime?.message}
					</span>
				*/}
			</div>

			<input
				className="my-1 w-full text-2xl font-bold"
				placeholder="Place name, address, or link"
				type="text"
				{...register("location", {
					required: "This field is required",
					maxLength: 256,
				})}
			/>
			{/* <span className="text-error">{errors.location?.message}</span> */}

			<div className="my-1 flex items-center justify-between">
				<span className="w-3/12 text-xl font-bold">Hosted by</span>{" "}
				<input
					className="w-9/12 text-xl font-bold"
					placeholder="(optional) Nickname"
					type="text"
					{...register("hosts", {
						maxLength: 256,
					})}
				/>
			</div>

			<textarea
				className="mt-1 w-full"
				placeholder="(optional) Add a description of your event"
				rows={3}
				{...register("description", {
					maxLength: 256,
				})}
			/>

			{!shortId && (
				<input
					className="btn btn-primary my-2 w-full"
					type="submit"
					value={loggedIn ? "Create Party!" : "Sign in to Continue"}
				/>
			)}
		</form>
	);
};

export default CustomizeEventSkeleton;
