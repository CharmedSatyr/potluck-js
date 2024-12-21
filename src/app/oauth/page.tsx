import Form from "next/form";
import { DiscordIcon } from "@/components/icons/discord";
import signInWithDiscordAndRevalidate from "@/actions/auth/sign-in-with-discord-and-revalidate";
import Image from "next/image";
import siteMetadata from "@/data/site-metadata";

const OauthPage = async () => {
	return (
		<Form
			action={signInWithDiscordAndRevalidate}
			className="flex flex-col items-center"
		>
			<h1>Come on in!</h1>

			<Image
				alt={`${siteMetadata.title} logo`}
				className="max-w-sm rounded-lg shadow-2xl"
				priority
				src="/static/login.webp"
				width="400"
				height="400"
			/>

			<button className="btn btn-primary my-6 w-full" type="submit">
				Continue with Discord <DiscordIcon className="size-4" />
			</button>
		</Form>
	);
};

export default OauthPage;
