


import Form from "next/form";
import { signIn } from "@/auth";
import { DiscordIcon } from "@/components/icons/discord";

type Props = {
    params: Promise<{ code: string }>;
    searchParams: Promise<{ [key: string]: string }>;
};

const OauthPage = async ({ params, searchParams }: Props) => {
    return (
        <Form
            action={async () => {
                "use server";
                //               const search = await searchParams;

                // await signIn("discord")//, {
                /*
                redirectTo: `/event/${code}/edit`
                    .concat("?")
                    .concat(new URLSearchParams(search).toString()),
            });
            */
            }}
        >
            <h1>Please sign in.</h1>
            <button className="btn btn-primary my-6 w-full" type="submit">
                Continue with Discord <DiscordIcon className="size-4" />
            </button>
        </Form>
    );
}

export default OauthPage