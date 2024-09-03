"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import signInWithDiscord from "@/actions/auth/sign-in-with-discord";
import createParty from "@/actions/db/create-party";
import CustomizeEventSkeleton from "@/components/customize-event-skeleton";
import useCreatePartySessionStorage from "@/hooks/use-create-party-session-storage";
import { CustomizablePartyValues } from "@/db/schema/parties";

const CreateEventManager = () => {
	const { data: authData, status } = useSession();
	const loggedIn = status === "authenticated";

	const { push } = useRouter();
	const [storageValues, setStorageValues, removeStorageValues] =
		useCreatePartySessionStorage();

	const {
		formState: { errors },
		handleSubmit,
		register,
		reset,
		setValue,
		getValues,
	} = useForm<CustomizablePartyValues>({
		defaultValues: {},
	});

	useEffect(() => {
		if (!storageValues) {
			return;
		}

		for (const property in storageValues) {
			const key = property as keyof CustomizablePartyValues;
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
	}, [reset, setValue]);

	const onSubmit = handleSubmit(async (data: CustomizablePartyValues) => {
		if (!loggedIn) {
			await signInWithDiscord();

			return;
		}

		try {
			if (!data.hosts && authData?.user?.name) {
				data.hosts = authData.user.name;
			}

			const shortId = await createParty(data);

			removeStorageValues();

			push(`/start/plan-food?event=${shortId}`);
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
