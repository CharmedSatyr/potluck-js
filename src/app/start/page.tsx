"use client";

import { Suspense } from "react";
import ManageEventWizard from "@/components/manage-event-wizard";

const StartPage = () => {
	return (
		<div className="flex h-full w-full flex-col items-center">
			<Suspense>
				<ManageEventWizard />
			</Suspense>
		</div>
	);
};

export default StartPage;
