"use client";

import _ from "lodash";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import updateEvent, { UpdatedEvent } from "@/actions/db/update-event";
import { CustomizableEventValues, Event } from "@/db/schema/event";
import CustomizeEventSkeleton from "@/components/customize-event-skeleton";
import { revalidatePage } from "@/actions/revalidate-path";

type Props = Event;

const EditEventManager = ({
	code,
	description,
	hosts,
	location,
	name,
	startDate,
	startTime,
	userId,
}: Props) => {
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
				push(`/event/${code}`);
				return;
			}

			const updatedEvent = { ...modifiedValues, code };

			const result = await updateEvent(updatedEvent);

			if (!result.length) {
				throw new Error("Failed to update event");
			}

			await revalidatePage(`/event/${code}`);

			push(`/event/${code}`);
		} catch (err) {
			console.error(err);
		}
	});

	if (session?.data?.user?.id !== userId) {
		replace(`/event/${code}`);
	}

	return (
		<CustomizeEventSkeleton
			code={code}
			errors={errors}
			onSubmit={onSubmit}
			register={register}
		/>
	);
};

export default EditEventManager;
