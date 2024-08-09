import { signIn } from "@/auth";

const SignIn = () => {
	return (
		<form
			action={async () => {
				"use server";

				const result = await signIn("discord");
				console.log("Login result: ", result);
			}}
		>
			<button className="btn btn-primary" type="submit">Signin with Discord</button>
		</form>
	);
};

export default SignIn;
