import Form from "next/form";
import signInWithDiscordAndRevalidate from "@/actions/auth/sign-in-with-discord-and-revalidate";
import { auth } from "@/auth";

const SignIn = async () => {
	const session = await auth();

	if (session?.user) {
		return null;
	}

	return (
		<Form action={signInWithDiscordAndRevalidate}>
			<button className="btn btn-accent" type="submit">
				Sign In with Discord
			</button>
		</Form>
	);
};

export default SignIn;
