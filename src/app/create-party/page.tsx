"use client";

import createParty from "@/actions/create-party";
import { type Party } from "@/db/schema/party";
import { ChangeEvent, useState } from "react";

const CreatePartyPage = () => {
	const [createdBy, setCreatedBy] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [hosts, setHosts] = useState<string>("");
	const [name, setName] = useState<string>("");

	const onSubmit = (e: any) => {
		e?.preventDefault();

		console.log("Submitting...");

		createParty({ createdBy, description, hosts, name });
	};

	return (
		<form
			onSubmit={onSubmit}
			className="m-20 flex w-1/2 flex-col text-slate-900"
		>
			<input
				className="mb-4 text-slate-900"
				type="text"
				value="Joseph"
				placeholder="Created By"
				onChange={(e) => setCreatedBy(e.target.value)}
			/>
			<input
				className="mb-4"
				type="text"
				value="We eat tonight"
				placeholder="Description"
				onChange={(e) => setDescription(e.target.value)}
			/>
			<input
				className="mb-4"
				type="text"
				value="Joseph & Inga Wolfe"
				placeholder="Hosts"
				onChange={(e) => setHosts(e.target.value)}
			/>
			<input
				className="mb-4"
				type="text"
				value="Taco Tuesday!"
				placeholder="Name"
				onChange={(e) => setName(e.target.value)}
			/>
			<button
				className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
				type="submit"
			>
				Submit
			</button>
		</form>
	);
};

export default CreatePartyPage;
