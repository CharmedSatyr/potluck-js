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
import { CustomizablePartyValues, Party } from "@/db/schema/parties";
import CustomizeEventSkeleton from "@/components/customize-event-skeleton";

type EditEventManagerProps = Party;

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
	} = useForm<CustomizablePartyValues>({
		defaultValues: {
			name,
			startDate,
			startTime,
			location,
			hosts,
			description,
		},
	});

	const onSubmit = handleSubmit(async (data: CustomizablePartyValues) => {
		try {
			const modifiedValues = _.pickBy<UpdatedParty>(
				data,
				(_value, key) =>
					getFieldState(key as keyof CustomizablePartyValues).isDirty
			);

			if (Object.keys(modifiedValues).length === 0) {
				push(`/party/${shortId}`);
				return;
			}

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
