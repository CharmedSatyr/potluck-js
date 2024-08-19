"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import signInWithDiscord from "@/actions/auth/sign-in-with-discord";
import createParty, { isNewParty, NewParty } from "@/actions/db/create-party";
import formatIsoTime from "@/utilities/format-iso-time";
import useCreatePartySessionStorage from "@/hooks/use-create-party-session-storage";

type FormInput = NewParty;

const CreatePartyForm = () => {
	const { status } = useSession();
	const loggedIn = status === "authenticated";

	const { push } = useRouter();
	const [storageValues, setStorageValues, removeStorageValues] =
		useCreatePartySessionStorage();

	const {
		formState: { errors },
		handleSubmit,
		register,
		reset,
		setValue,
	} = useForm<FormInput>({
		defaultValues: {},
	});

	useEffect(() => {
		if (!storageValues) {
			return;
		}

		for (const property in storageValues) {
			setValue(
				property as keyof FormInput,
				storageValues[property as keyof FormInput] ?? null,
				{ shouldValidate: true }
			);
		}

		return () => reset();
	}, []);

	const onSubmit = async (data: FormInput) => {
		setStorageValues(data);

		if (!loggedIn) {
			await signInWithDiscord();

			return;
		}

		try {
			if (!isNewParty(data)) {
				return;
			}

			const shortId = await createParty(data);

			removeStorageValues();

			push(`/party/${shortId}`);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<form className="my-12 w-4/6" onSubmit={handleSubmit(onSubmit)}>
			<div className="mb-4">
				<h1 className="my-0 py-0 text-6xl text-primary">
					<input
						className="w-full px-2"
						type="text"
						placeholder="Untitled Event"
						{...register("name", {
							required: "This field is required",
							maxLength: 256,
						})}
					/>
				</h1>
				<span className="mt-0 text-error">{errors.name?.message}</span>
			</div>

			<div className="my-4">
				<h2 className="my-0 flex w-full justify-between py-0 font-normal">
					<input
						className="px-2"
						type="date"
						{...register("startDate", {
							required: "This field is required",
						})}
					/>{" "}
					at{" "}
					<input
						className="w-4/12 px-2"
						type="time"
						step={60}
						{...register("startTime", {
							required: "This field is required",
							setValueAs: formatIsoTime,
						})}
					/>
				</h2>
				<span className="mt-0 text-error">{errors.startDate?.message}</span>
				<span className="float-right mt-0 text-error">
					{errors.startTime?.message}
				</span>
			</div>

			<div className="my-4">
				<h2 className="my-0 py-0">
					<input
						type="text"
						className="w-full px-2"
						placeholder="Place name, address, or link"
						{...register("location", {
							required: "This field is required",
							maxLength: 256,
						})}
					/>
				</h2>
				<span className="text-error">{errors.location?.message}</span>
			</div>

			<div className="my-4">
				<h3 className="my-0 flex w-full justify-between py-0">
					<span className="w-3/12">Hosted by </span>
					<input
						className="w-10/12 px-2"
						type="text"
						placeholder="(optional) Nickname"
						{...register("hosts", {
							maxLength: 256,
						})}
					/>
				</h3>
			</div>

			<div className="my-4">
				<textarea
					className="w-full px-2"
					rows={3}
					placeholder="(optional) Add a description of your event"
					{...register("description", {
						maxLength: 256,
					})}
				/>
			</div>

			<input
				className="btn btn-primary w-full"
				type="submit"
				value={loggedIn ? "Create Party!" : "Sign in to Continue"}
			/>
		</form>
	);
};

export default CreatePartyForm;
