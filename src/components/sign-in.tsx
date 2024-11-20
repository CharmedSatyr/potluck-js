import Form from "next/form";
import signInWithDiscordAndRevalidate from "@/actions/auth/sign-in-with-discord-and-revalidate";
import { auth } from "@/auth";
import { DiscordIcon } from "./icons/discord";

const SignIn = async () => {
	const session = await auth();

	if (session?.user) {
		return null;
	}

	return (
		<Form action={signInWithDiscordAndRevalidate}>
			<button className="btn btn-accent btn-sm" type="submit">
				Sign In <DiscordIcon height="16" width="16" />
			</button>
		</Form>
	);
};

export default SignIn;
