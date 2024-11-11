"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import ManageEventWizard from "@/components/manage-event-wizard";
import { createEventAction, loginAction } from "@/app/start/submit-actions";

const StartPage = () => {
	const session = useSession();

	const submitAction =
		session.status === "authenticated" ? createEventAction : loginAction;

	return (
		<div className="flex h-full w-full flex-col items-center">
			<Suspense fallback="TODO: Add skeleton">
				<ManageEventWizard submitAction={submitAction} />
			</Suspense>
		</div>
	);
};

export default StartPage;
