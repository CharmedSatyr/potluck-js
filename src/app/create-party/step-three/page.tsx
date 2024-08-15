"use client";

import { startTransition } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import createParty from "@/actions/db/create-party";
import { FormInput } from "@/app/create-party/page";
import { useSession } from "next-auth/react";

const StepThree = () => {
	const { status } = useSession();
	const { push } = useRouter();
	const {
		formState: { errors },
		handleSubmit,
		register,
	} = useFormContext<FormInput>();

	const submit = (data: FormInput) => {
		if (status !== "authenticated") {
			return;
		}

		startTransition(async () => {
			if (Object.keys(errors).length > 0) {
				return;
			}

			try {
				const shortId = await createParty(data);

				if (!shortId) {
					throw new Error("Failed to create event");
				}

				push(`/party/${shortId}`);
			} catch (err) {
				console.error(err);
			}
		});
	};

	return (
		<>
			<form onSubmit={handleSubmit(submit)}>
				<div className="my-2">
					<label htmlFor="description" className="label label-text">
						Description{" "}
					</label>
					<div className="input input-bordered flex items-center gap-2">
						<input
							className="grow"
							id="description"
							type="text"
							{...register("description", { required: false, maxLength: 256 })}
						/>
						<span className="badge badge-accent">Optional</span>
					</div>
					<span className="error">{errors.description?.message}</span>
				</div>

				<input type="submit" className="btn btn-primary my-8 w-full" />
			</form>

			<ul className="steps w-full">
				<li className="step step-secondary">Create an Event</li>
				<li className="step step-secondary">Set the Location</li>
				<li className="step step-secondary">Describe the Event</li>
			</ul>
		</>
	);
};

export default StepThree;
