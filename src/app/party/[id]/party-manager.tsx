"use client";

import { Dish } from "@/db/schema/dishes";
import { Party } from "@/db/schema/parties";
import { useState, Dispatch, SetStateAction } from "react";
import { SessionProvider } from "next-auth/react";
import DishManager from "./dish-manager";
import { Session } from "next-auth";
import updateParty, { UpdateValues } from "@/actions/db/update-party";
import { useForm } from "react-hook-form";
import formatIsoTime from "@/utilities/format-iso-time";
import _ from "lodash";

const options: Intl.DateTimeFormatOptions = {
	weekday: "long",
	year: "numeric",
	month: "long",
	day: "numeric",
};

const formatStartTime = (startTime: string) => {
	const time = startTime.split(":");
	const hours = parseInt(time[0]);
	const minutes = time[1].padStart(2, "0");

	if (hours > 12) {
		return `${hours - 12}:${minutes} PM`;
	}

	return `${hours}:${minutes} AM`;
};

interface Props {
	dishes: Dish[];
	party: Party;
	session: Session | null;
}

interface EditButtonProps {
	setEditing: Dispatch<SetStateAction<boolean>>;
}

const EditButton = ({ setEditing }: EditButtonProps) => (
	<button
		className="btn btn-primary float-right"
		onClick={() => setEditing(true)}
		type="button"
	>
		Edit
	</button>
);

type FormInput = UpdateValues;

const PartyManager = ({ dishes, party, session }: Props) => {
	const [editing, setEditing] = useState<boolean>(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		getFieldState,
		getValues,
	} = useForm<FormInput>({
		defaultValues: {
			description: party.description ?? undefined,
			hosts: party.hosts,
			location: party.location,
			name: party.name,
			startDate: party.startDate,
			startTime: party.startTime.substring(0, party.startTime.length - 3),
		},
	});

	const isHost = party.createdBy === session?.user?.email;

	if (editing && isHost) {
		return (
			<form
				className="w-full"
				onSubmit={handleSubmit(async (data: FormInput) => {
					try {
						setEditing(false);
						const modifiedValues = _.pickBy<UpdateValues>(
							data,
							(_value, key) => getFieldState(key as keyof UpdateValues).isDirty
						);

						await updateParty({ ...modifiedValues, shortId: party.shortId });
						// TODO: Reset "isDirty" on success.
					} catch (err) {
						console.error(err);
					}
				})}
			>
				<input
					className="btn btn-primary float-right"
					type="submit"
					value="Save"
				/>

				<h1 className="text-primary">
					<input
						type="text"
						{...register("name", {
							required: "This field is required",
							maxLength: 256,
						})}
					/>
				</h1>
				<span className="text-error">{errors.name?.message}</span>

				<h2 className="mt-0">
					<input
						type="text"
						className="w-full"
						{...register("location", {
							required: "This field is required",
							maxLength: 256,
						})}
					/>
				</h2>
				<span className="text-error">{errors.location?.message}</span>

				<h2 className="mt-0 font-normal text-neutral">
					<time className="font-bold">
						<input
							type="date"
							{...register("startDate", {
								required: true,
							})}
						/>
					</time>{" "}
					at{" "}
					<time className="font-bold" dateTime={getValues().startTime}>
						<input
							type="time"
							step={60}
							{...register("startTime", {
								required: true,
								setValueAs: formatIsoTime,
							})}
						/>
					</time>
				</h2>

				<h3>
					Hosted by{" "}
					<input type="text" {...register("hosts", { required: true })} />
				</h3>

				<div>
					<input
						className="w-full"
						type="text w-full"
						{...register("description")}
					/>
				</div>
			</form>
		);
	}

	return (
		<SessionProvider session={session}>
			{isHost && <EditButton setEditing={setEditing} />}
			<h1 className="text-primary">{getValues().name}</h1>
			<h2 className="mt-0">{getValues().location}</h2>
			<h2 className="mt-0 font-normal text-neutral">
				<time className="font-bold" dateTime={getValues().startDate}>
					{new Date(getValues().startDate!).toLocaleDateString(
						"en-US",
						options
					)}
				</time>{" "}
				at{" "}
				<time className="font-bold" dateTime={party.startTime}>
					{formatStartTime(getValues().startTime!)}
				</time>
			</h2>
			<h3>Hosted by {getValues().hosts}</h3>
			<div>{getValues().description}</div>

			<DishManager dishes={dishes} />
		</SessionProvider>
	);
};

export default PartyManager;
