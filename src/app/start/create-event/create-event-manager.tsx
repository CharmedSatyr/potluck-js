"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import signInWithDiscord from "@/actions/auth/sign-in-with-discord";
import createEvent from "@/actions/db/create-event";
import CustomizeEventSkeleton from "@/components/customize-event-skeleton";
import useCreateEventSessionStorage from "@/hooks/use-create-event-session-storage";
import { CustomizableEventValues } from "@/db/schema/event";

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
	} = useForm<CustomizableEventValues>({
		defaultValues: {},
	});

	useEffect(() => {
		if (!storageValues) {
			return;
		}

		for (const property in storageValues) {
			const key = property as keyof CustomizableEventValues;
			const value = storageValues[key];

			if (value === undefined) {
				continue;
			}

			setValue(key, value, { shouldValidate: true });
		}

		return () => {
			if (!loggedIn) {
				setStorageValues(getValues());
			}
			reset();
		};
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [reset, setValue]);

	const onSubmit = handleSubmit(async (data: CustomizableEventValues) => {
		if (!loggedIn) {
			await signInWithDiscord();

			return;
		}

		try {
			if (!data.hosts && authData?.user?.name) {
				data.hosts = authData.user.name;
			}

			const eventCode = await createEvent(data);

			removeStorageValues();

			push(`/start/plan-food?event=${eventCode}`);
		} catch (err) {
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
