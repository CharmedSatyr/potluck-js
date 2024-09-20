"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import signInWithDiscord from "@/actions/auth/sign-in-with-discord";
import createEvent from "@/actions/db/create-event";
import { schema, CreateEventData } from "@/actions/db/create-event.types";
import CustomizeEventSkeleton from "@/components/customize-event-skeleton";
import useCreateEventSessionStorage from "@/hooks/use-create-event-session-storage";

const CreateEventManager = () => {
	const { data: authData, status } = useSession();
	const loggedIn = status === "authenticated";

	const { push } = useRouter();
	const [storageValues, setStorageValues, removeStorageValues] =
		useCreateEventSessionStorage();

	const {
		formState: { errors },
		handleSubmit,
		register,
		reset,
		setValue,
		getValues,
	} = useForm<CreateEventData>({
		resolver: zodResolver(schema),
		defaultValues: {},
	});

	useEffect(() => {
		if (!storageValues) {
			return;
		}

		for (const property in storageValues) {
			const key = property as keyof CreateEventData;
			const value = storageValues[key];

			if (value === undefined) {
				continue;
			}

			setValue(key, value, { shouldValidate: true });
		}

		return () => {
			// Potentially unmounting for auth redirect. Save to repopulate fields after auth.
			if (!loggedIn) {
				setStorageValues(getValues());
			}
			reset();
		};
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [reset, setValue]);

	const onSubmit = handleSubmit(async (data: CreateEventData) => {
		if (!loggedIn) {
			await signInWithDiscord();

			return;
		}

		try {
			if (!data.hosts && authData?.user?.name) {
				data.hosts = authData.user.name;
			}

			const [event] = await createEvent(data);
			if (!event) {
				// TODO: Allow retry.
				return;
			}

			removeStorageValues();

			push(`/start/plan-food?event=${event.code}`);
		} catch (err) {
			// TODO: Handle error
			console.error(err);
		}
	});

	return (
		<CustomizeEventSkeleton
			errors={errors}
			onSubmit={onSubmit}
			register={register}
		/>
	);
};

export default CreateEventManager;
