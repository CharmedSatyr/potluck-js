"use client";

import _ from "lodash";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
	isUpdatedEvent,
	UpdatedEvent,
	updateEventAndRevalidate,
} from "@/actions/db/update-event";
import { CustomizableEventValues, Event } from "@/db/schema/event";
import CustomizeEventSkeleton from "@/components/customize-event-skeleton";

type EditEventManagerProps = Event;

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
	} = useForm<CustomizableEventValues>({
		defaultValues: {
			name,
			startDate,
			startTime,
			location,
			hosts,
			description,
		},
	});

	const onSubmit = handleSubmit(async (data: CustomizableEventValues) => {
		try {
			const modifiedValues = _.pickBy<UpdatedEvent>(
				data,
				(_value, key) =>
					getFieldState(key as keyof CustomizableEventValues).isDirty
			);

			if (Object.keys(modifiedValues).length === 0) {
				push(`/event/${shortId}`);
				return;
			}

			const updatedEvent = { ...modifiedValues, shortId };

			if (!isUpdatedEvent(updatedEvent)) {
				throw new Error("Update event form values invalid");
			}

			const result = await updateEventAndRevalidate(updatedEvent);

			if (!result.length) {
				throw new Error("Failed to update event");
			}

			push(`/event/${shortId}`);
		} catch (err) {
			console.error(err);
		}
	});

	if (session?.data?.user?.email !== createdBy) {
		replace(`/event/${shortId}`);
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
