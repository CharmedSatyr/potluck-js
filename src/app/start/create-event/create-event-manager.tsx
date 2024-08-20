"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import signInWithDiscord from "@/actions/auth/sign-in-with-discord";
import createParty, { isNewParty, NewParty } from "@/actions/db/create-party";
import EditEventSkeleton from "@/components/customize-event-skeleton";
import useCreatePartySessionStorage from "@/hooks/use-create-party-session-storage";

type FormInput = NewParty;

const CreateEventManager = () => {
	const { status } = useSession();
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
	} = useForm<FormInput>({
		defaultValues: {},
	});

	useEffect(() => {
		if (!storageValues) {
			return;
		}

		for (const property in storageValues) {
			setValue(
				property as keyof FormInput,
				storageValues[property as keyof FormInput] ?? null,
				{ shouldValidate: true }
			);
		}

		return () => reset();
	}, []);

	const onSubmit = handleSubmit(async (data: FormInput) => {
		setStorageValues(data);

		if (!loggedIn) {
			await signInWithDiscord();

			return;
		}

		try {
			if (!isNewParty(data)) {
				return;
			}

			const shortId = await createParty(data);

			removeStorageValues();

			push(`/start/plan-food?event=${shortId}`);
		} catch (err) {
			console.error(err);
		}
	});

	return <EditEventSkeleton onSubmit={onSubmit} register={register} />;
};

export default CreateEventManager;
