"use client";

import { useActionState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import submitAction from "@/app/start/create-event/submit-action";
import {
	formSchema,
	CreateEventFormData,
} from "@/app/start/create-event/submit-action.types";
import CustomizeEventSkeleton from "@/components/customize-event-skeleton";

const CreateEventManager = () => {
	const { push } = useRouter();
	const ref = useRef<HTMLFormElement>(null);

	const [state, formAction] = useActionState(submitAction, {
		fields: {},
		message: "",
		success: false,
	});

	const form = useForm<CreateEventFormData>({
		resolver: zodResolver(formSchema),
		defaultValues: state.fields,
	});

	useEffect(() => {
		if (!state.success) {
			console.error("Message:", state.message, "\nIssues:", state.issues);
			return;
		}

		push(`/event/${state.code}`);
	}, [push, state]);

	return (
		<CustomizeEventSkeleton form={form} ref={ref} submitAction={formAction} />
	);
};

export default CreateEventManager;
