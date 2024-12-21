import Form from "next/form";
import { DiscordIcon } from "@/components/icons/discord";
import signInWithDiscordAndRevalidate from "@/actions/auth/sign-in-with-discord-and-revalidate";

type Props = {
	params: Promise<{ code: string }>;
	searchParams: Promise<{ [key: string]: string }>;
};

const OauthPage = async ({ params, searchParams }: Props) => {
	return (
		<Form action={signInWithDiscordAndRevalidate}>
			<h1>Please sign in.</h1>

			<button className="btn btn-primary my-6 w-full" type="submit">
				Continue with Discord <DiscordIcon className="size-4" />
			</button>
		</Form>
	);
};

export default OauthPage;
