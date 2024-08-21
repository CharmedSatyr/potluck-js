"use client";

import _ from "lodash";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
	isUpdatedParty,
	UpdatedParty,
	updatePartyAndRevalidate,
} from "@/actions/db/update-party";
import { Party } from "@/db/schema/parties";
import CustomizeEventSkeleton from "@/components/customize-event-skeleton";

type EditEventManagerProps = Party;

type FormInput = UpdatedParty;

const EditEventManager = ({
	createdBy,
	description,
	hosts,
	location,
	name,
	shortId,
	startDate,
	startTime,
}: EditEventManagerProps) => {
	const session = useSession();
	const { push, replace } = useRouter();
	const {
		formState: { errors },
		getFieldState,
		handleSubmit,
		register,
	} = useForm<FormInput>({
		defaultValues: {
			name,
			startDate,
			startTime,
			location,
			hosts,
			description: description ?? undefined, // TODO: Fix this
		},
	});

	const onSubmit = handleSubmit(async (data: FormInput) => {
		try {
			const modifiedValues = _.pickBy<UpdatedParty>( // TODO: What is this type?
				data,
				(_value, key) => getFieldState(key as keyof UpdatedParty).isDirty
			);

			const updatedParty = { ...modifiedValues, shortId };

			if (!isUpdatedParty(updatedParty)) {
				throw new Error("Update event form values invalid");
			}

			const result = await updatePartyAndRevalidate(updatedParty);

			if (!result.length) {
				throw new Error("Failed to update event");
			}

			push(`/party/${shortId}`);
		} catch (err) {
			console.error(err);
		}
	});

	if (session?.data?.user?.email !== createdBy) {
		replace(`/party/${shortId}`);
	}

	return (
		<CustomizeEventSkeleton
			errors={errors}
			onSubmit={onSubmit}
			register={register}
			shortId={shortId}
		/>
	);
};

export default EditEventManager;
