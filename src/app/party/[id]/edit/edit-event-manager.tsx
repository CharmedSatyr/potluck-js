"use client";

import _ from "lodash";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import updateParty, {
	isUpdatedParty,
	UpdatedParty,
} from "@/actions/db/update-party";
import { Party } from "@/db/schema/parties";
import CustomizeEventSkeleton from "@/components/customize-event-skeleton";

type EditEventManagerProps = Party;

type FormInput = UpdatedParty;

const EditEventManager = ({
	createdBy,
	name,
	shortId,
	startDate,
	startTime,
	location,
	hosts,
	description,
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

			await updateParty(updatedParty);

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
