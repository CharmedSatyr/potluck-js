import { auth, signOut } from "@/auth";

const SignOut = async () => {
	const session = await auth();

	if (!session?.user) {
		return null;
	}

	return (
		<form
			action={async () => {
				"use server";
				await signOut();
			}}
		>
			<button className="btn btn-secondary" type="submit">
				Sign Out
			</button>
		</form>
	);
};

export default SignOut;
