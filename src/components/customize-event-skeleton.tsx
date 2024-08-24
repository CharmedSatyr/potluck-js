"use client";

import _ from "lodash";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useSession } from "next-auth/react";
import { CustomizablePartyValues } from "@/db/schema/parties";
import formatIsoTime from "@/utilities/format-iso-time";

interface CustomizeEventSkeletonProps {
	errors: FieldErrors<Partial<CustomizablePartyValues>>;
	onSubmit: React.FormEventHandler<HTMLFormElement>;
	register: UseFormRegister<any>; // TODO: Clarify this type.
	shortId?: string;
}

const TitleManagement = ({ shortId }: { shortId?: string }) => {
	if (!shortId) {
		return <h1>Create an Event</h1>;
	}

	return (
		<div className="flex justify-between">
			<h1>
				Party Code: <span className="text-secondary">{shortId}</span>
			</h1>
			<input className="btn btn-primary" type="submit" value="Save" />
		</div>
	);
};

export const CustomizeEventSkeleton = ({
	errors,
	onSubmit,
	register,
	shortId,
}: CustomizeEventSkeletonProps) => {
	const { data: authData, status } = useSession();
	const loggedIn = status === "authenticated";

	const username = authData?.user?.name;

	return (
		<form
			className="form-control w-full lg:w-5/6 xl:w-2/3 2xl:w-1/2"
			onSubmit={onSubmit}
		>
			<TitleManagement shortId={shortId} />

			<input
				className={`input-text input input-lg -mt-1 mb-1 w-full px-0 text-6xl font-extrabold text-primary ${errors.name && "input-secondary border"}`}
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
						className="input px-0 text-2xl"
						type="date"
						{...register("startDate", {
							required: "Date is required",
						})}
					/>{" "}
					<span className="text-2xl font-bold"> at </span>
					<input
						className="input w-4/12 text-2xl"
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

			<div className="mb-2 mt-1">
				<input
					className="input-text input my-0 w-full px-0 text-2xl"
					placeholder="Place name, address, or link"
					type="text"
					{...register("location", {
						required: "Location is required",
						maxLength: 256,
					})}
				/>
				<span className="mb-0 text-secondary">{errors.location?.message}</span>
			</div>

			<div className="my-0 flex flex-col">
				<div className="flex items-center justify-between">
					<span className="-mr-5 w-3/12 text-xl font-bold">Hosted by</span>{" "}
					<input
						className="input-text input w-full px-0 py-0 text-xl"
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

			<textarea
				className="input-text input mt-0 w-full px-0"
				placeholder="(optional) Add a description of your event"
				rows={3}
				{...register("description", {
					maxLength: 256,
				})}
			/>

			{!shortId && (
				<input
					className="btn btn-primary my-2 w-full"
					disabled={false} // Object.keys(errors).length > 0
					type="submit"
					value={loggedIn ? "Create Party!" : "Sign in to Continue"}
				/>
			)}
		</form>
	);
};

export default CustomizeEventSkeleton;
