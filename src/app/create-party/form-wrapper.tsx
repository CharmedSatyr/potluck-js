"use client";

import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";

const defaultValues = {
	description: "A day to celebrate farmers and farmers markets!",
	hosts: "Joseph & Inga Wolfe",
	location: "100 Rue de Boeuf, Paris, France 1000",
	name: "Vegetable Monday",
	startDate: "2025-01-09",
	startTime: "13:00",
};

const FormWrapper = ({ children }: PropsWithChildren) => {
	const { back } = useRouter();

	const methods = useForm(
		process.env.NODE_ENV === "development" ? { defaultValues } : undefined
	);

	return (
		<FormProvider {...methods}>
			<button className="btn btn-accent" onClick={back}>
				Back
			</button>
			{children}
		</FormProvider>
	);
};

export default FormWrapper;
