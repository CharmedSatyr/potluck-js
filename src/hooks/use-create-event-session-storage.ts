import { Dispatch } from "react";
import { CustomizableEventValues } from "@/db/schema/event";
import useSessionStorage from "@/hooks/use-session-storage";

type useCreateEventSessionOut = readonly [
	Partial<CustomizableEventValues>,
	Dispatch<Partial<CustomizableEventValues>>,
	() => void,
];

const CREATE_PARTY_SESSION_KEY = "createEventSessionKey";

const useCreateEventSession = (): useCreateEventSessionOut => {
	return useSessionStorage<Partial<CustomizableEventValues>>(
		CREATE_PARTY_SESSION_KEY,
		{}
	);
};

export default useCreateEventSession;
