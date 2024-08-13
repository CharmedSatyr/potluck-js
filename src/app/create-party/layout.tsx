"use client";

import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";

const defaultValues = {
	description: "A day to celebrate farmers and farmers markets!",
	end: "2025-01-09T15:00", // Automatically converted by valueAsDate
	hosts: "Joseph & Inga Wolfe",
	location: "100 Rue de Boeuf, Paris, France 1000",
	name: "Vegetable Monday",
	start: "2025-01-09T12:00", // Automatically converted by valueAsDate
};

const Layout = ({ children }: PropsWithChildren) => {
	const { back } = useRouter();

	const methods = useForm({
		defaultValues,
	});

	return (
		<FormProvider {...methods}>
			<button className="btn btn-accent" onClick={back}>
				Back
			</button>
			{children}
		</FormProvider>
	);
};

export default Layout;
