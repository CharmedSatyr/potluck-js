import Form from "next/form";
import signInWithDiscord from "@/actions/auth/sign-in-with-discord";
import { auth } from "@/auth";

const SignIn = async () => {
	const session = await auth();

	if (session?.user) {
		return null;
	}

	return (
		<Form action={signInWithDiscord}>
			<button className="btn btn-accent" type="submit">
				Sign In with Discord
			</button>
		</Form>
	);
};

export default SignIn;
