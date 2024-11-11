"use client";

import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ManageEventWizard from "@/components/manage-event-wizard";
import { createEventAction, loginAction } from "@/app/start/submit-actions";
import { CreateEventFormData } from "@/app/start/submit-actions.types";
import { useSearchParams } from "next/navigation";

const DEV = process.env.NODE_ENV === "development";

const StartPage = () => {
	const searchParams = useSearchParams();
	const session = useSession();

	const code = searchParams.get("code");

	const submitAction =
		session.status === "authenticated" ? createEventAction : loginAction;

	const [defaultValues] = useState<CreateEventFormData>(() => {
		const values: CreateEventFormData = {
			description: "",
			hosts: "",
			location: DEV ? "123 Main Street" : "",
			name: DEV ? "Test Event" : "",
			startDate: DEV ? "2025-01-09" : "",
			startTime: DEV ? "12:00" : "",
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

	return (
		<div className="flex h-full w-full flex-col items-center">
			<Suspense fallback="TODO: Add skeleton">
				<ManageEventWizard
					code={code}
					eventData={defaultValues}
					submitAction={submitAction}
				/>
			</Suspense>
		</div>
	);
};

export default StartPage;
