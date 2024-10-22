"use client";

import { useActionState, useEffect, useState } from "react";
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
	CreateEventFormState,
} from "@/app/start/create-event/submit-actions.types";
import CustomizeEventSkeleton from "@/components/customize-event-skeleton";
import { useSession } from "next-auth/react";
import LoadingIndicator from "@/components/loading-indicator";

const CreateEventManager = () => {
	const path = usePathname();
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
	}, [defaultValues, path]);

	const submitAction =
		session.status === "authenticated" ? createEventAction : loginAction;

	const [state, formAction, isPending] = useActionState<
		CreateEventFormState,
		FormData
	>(submitAction, {
		fields: defaultValues,
		message: "",
		path,
		success: false,
	});

	const form = useForm<CreateEventFormData>({
		mode: "onTouched",
		resolver: zodResolver(formSchema),
		defaultValues: { ...defaultValues, ...state.fields },
	});

	useEffect(() => {
		if (!state.success) {
			return;
		}

		push(`/start/${state.code}/plan-food`);
	}, [push, state]);

	const loading = isPending || state.success;

	return (
		<div className="flex items-center justify-center">
			<CustomizeEventSkeleton
				form={form}
				loading={loading}
				submitAction={formAction}
			/>
			{loading && <LoadingIndicator />}
		</div>
	);
};

export default CreateEventManager;
