import signInWithDiscord from "@/actions/auth/sign-in-with-discord";
import { auth } from "@/auth";

const SignIn = async () => {
	const session = await auth();

	if (session?.user) {
		return null;
	}

	return (
		<form action={signInWithDiscord}>
			<button className="btn btn-accent" type="submit">
				Sign In with Discord
			</button>
		</form>
	);
};

export default SignIn;
