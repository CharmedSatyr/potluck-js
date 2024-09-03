import { Dispatch } from "react";
import { CustomizablePartyValues } from "@/db/schema/parties";
import useSessionStorage from "@/hooks/use-session-storage";

type useCreatePartySessionOut = readonly [
	Partial<CustomizablePartyValues>,
	Dispatch<Partial<CustomizablePartyValues>>,
	() => void,
];

const CREATE_PARTY_SESSION_KEY = "createPartySessionKey";

const useCreatePartySession = (): useCreatePartySessionOut => {
	return useSessionStorage<Partial<CustomizablePartyValues>>(
		CREATE_PARTY_SESSION_KEY,
		{}
	);
};

export default useCreatePartySession;
