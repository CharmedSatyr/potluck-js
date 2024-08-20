"use client";

import _ from "lodash";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import updateParty, {
	UpdatedParty,
	UpdateValues,
} from "@/actions/db/update-party";
import { Party } from "@/db/schema/parties";
import EditEventSkeleton from "@/components/customize-event-skeleton";

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
	const { getFieldState, handleSubmit, register } = useForm<FormInput>({
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
			const modifiedValues = _.pickBy<UpdateValues>( // TODO: What is this type?
				data,
				(_value, key) => getFieldState(key as keyof UpdateValues).isDirty
			);

			await updateParty({ ...modifiedValues, shortId });

			push(`/party/${shortId}`);
		} catch (err) {
			console.error(err);
		}
	});

	if (session?.data?.user?.email !== createdBy) {
		replace(`/party/${shortId}`);
	}

	return (
		<EditEventSkeleton
			onSubmit={onSubmit}
			register={register}
			shortId={shortId}
		/>
	);
};

export default EditEventManager;
