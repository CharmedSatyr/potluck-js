"use server";

import createEvent from "@/actions/db/create-event";
import { CreateEventData } from "@/actions/db/create-event.types";

const submitAction = async (prevState: unknown, formData: FormData) => {
	const data = Object.fromEntries(formData);
	return await createEvent(data as CreateEventData);
};

export default submitAction;
