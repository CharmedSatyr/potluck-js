import signOutAndRevalidate from "@/actions/auth/sign-out-and-revalidate";
import { auth } from "@/auth";

const SignOut = async () => {
	const session = await auth();

	if (!session?.user) {
		return null;
	}

	return (
		<form
			action={async () => {
				"use server";
				
				await signOutAndRevalidate();
			}}
		>
			<button className="btn btn-secondary" type="submit">
				Sign Out
			</button>
		</form>
	);
};

export default SignOut;
