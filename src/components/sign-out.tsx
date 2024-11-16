import Form from "next/form";
import signOutAndRevalidate from "@/actions/auth/sign-out-and-revalidate";
import { auth } from "@/auth";

const SignOut = async () => {
	const session = await auth();

	if (!session?.user) {
		return null;
	}

	return (
		<Form action={signOutAndRevalidate}>
			<button className="btn btn-sm btn-ghost" type="submit">
				Sign Out
			</button>
		</Form>
	);
};

export default SignOut;
