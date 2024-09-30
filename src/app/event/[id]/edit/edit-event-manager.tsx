"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { updateEventAction } from "@/app/event/[id]/edit/submit-actions";
import {
	formSchema,
	UpdateEventFormData,
	UpdateEventFormState,
} from "@/app/event/[id]/edit/submit-actions.types";
import { Event } from "@/db/schema/event";
import CustomizeEventSkeleton from "@/components/customize-event-skeleton";
import { useActionState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
	code: Event["code"];
	currentValues: Required<UpdateEventFormData>;
};

const EditEventManager = ({ code, currentValues }: Props) => {
	const { push } = useRouter();

	const [state, formAction, isPending] = useActionState<
		UpdateEventFormState,
		FormData
	>(updateEventAction, {
		code,
		fields: {},
		message: "",
		success: false,
	});

	const form = useForm<UpdateEventFormData>({
		resolver: zodResolver(formSchema),
		defaultValues: { ...currentValues, ...state.fields },
	});

	useEffect(() => {
		if (!state.success) {
			return;
		}

		push(`/event/${state.code}`);
	}, [state]);

	const loading =
		isPending ||
		state.success ||
		form.formState.isSubmitting ||
		form.formState.isSubmitSuccessful;

	return (
		<CustomizeEventSkeleton
			code={code}
			form={form}
			loading={loading}
			submitAction={formAction}
		/>
	);
};

export default EditEventManager;
