"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	createEventAction,
	loginAction,
} from "@/app/start/create-event/submit-actions";
import {
	formSchema,
	CreateEventFormData,
} from "@/app/start/create-event/submit-actions.types";
import CustomizeEventSkeleton from "@/components/customize-event-skeleton";
import { useSession } from "next-auth/react";
import LoadingIndicator from "@/components/loading-indicator";

const CreateEventManager = () => {
	const path = usePathname();
	const ref = useRef<HTMLFormElement>(null);
	const { push } = useRouter();
	const session = useSession();
	const searchParams = useSearchParams();

	const [defaultValues] = useState<CreateEventFormData>(() => {
		const values: CreateEventFormData = {
			description: "",
			hosts: "",
			location: "",
			name: "",
			startDate: "",
			startTime: "",
		};

		if (searchParams.get("source") !== "discord") {
			return values;
		}

		for (const key in values) {
			const searchValue = searchParams.get(key);
			if (!searchValue) {
				continue;
			}
			values[key as keyof CreateEventFormData] = searchValue;
		}

		return values;
	});

	useEffect(() => {
		if (!defaultValues) {
			return;
		}

		window.history.replaceState(null, "", path);
	}, [defaultValues]);

	const submitAction =
		session.status === "authenticated" ? createEventAction : loginAction;

	const [state, formAction, isPending] = useActionState(submitAction, {
		fields: {},
		message: "",
		path,
		success: false,
	});

	const form = useForm<CreateEventFormData>({
		resolver: zodResolver(formSchema),
		defaultValues: { ...defaultValues, ...state.fields },
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
		<div className="flex items-center justify-center">
			<CustomizeEventSkeleton
				form={form}
				loading={loading}
				ref={ref}
				submitAction={formAction}
			/>
			{loading && <LoadingIndicator />}
		</div>
	);
};

export default CreateEventManager;
