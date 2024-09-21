"use client";

import { useActionState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, CreateEventData } from "@/actions/db/create-event.types";
import CustomizeEventSkeleton from "@/components/customize-event-skeleton";
import submitAction from "./submit-action";

const CreateEventManager = () => {
	const ref = useRef<HTMLFormElement>(null);

	const [state, formAction] = useActionState(submitAction, undefined);

	const form = useForm<CreateEventData>({
		resolver: zodResolver(schema),
		defaultValues: {},
	});

	useEffect(() => {
		console.log("state:", state);
	}, [state]);

	return (
		<CustomizeEventSkeleton form={form} ref={ref} submitAction={formAction} />
	);
};

export default CreateEventManager;
