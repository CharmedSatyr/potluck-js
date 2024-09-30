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
import LoadingIndicator from "@/components/loading-indicator";

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
		fields: currentValues,
		message: "",
		success: false,
	});

	const form = useForm<UpdateEventFormData>({
		mode: "onTouched",
		resolver: zodResolver(formSchema),
		defaultValues: { ...currentValues, ...state.fields },
	});

	useEffect(() => {
		if (!state.success) {
			return;
		}

		push(`/event/${state.code}`);
	}, [state]);

	const loading = isPending || state.success;

	return (
		<div className="flex items-center justify-center">
			<CustomizeEventSkeleton
				code={code}
				form={form}
				loading={loading}
				submitAction={formAction}
			/>
			{loading && <LoadingIndicator />}
		</div>
	);
};

export default EditEventManager;
