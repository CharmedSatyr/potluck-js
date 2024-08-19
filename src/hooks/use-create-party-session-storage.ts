import { Dispatch } from "react";
import { NewParty } from "@/actions/db/create-party";
import useSessionStorage from "./use-session-storage";

type useCreatePartySessionOut = [
	Partial<NewParty>,
	Dispatch<Partial<NewParty>>,
	() => void,
];

const CREATE_PARTY_SESSION_KEY = "createPartySessionKey";

const useCreatePartySession = (): useCreatePartySessionOut => {
	return useSessionStorage<Partial<NewParty>>(CREATE_PARTY_SESSION_KEY);
};

export default useCreatePartySession;
