import { PropsWithChildren } from "react";
import FormWrapper from "@/app/create-party/form-wrapper";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const Layout = async ({ children }: PropsWithChildren) => {
	const session = await auth();
	return (
		<SessionProvider session={session}>
			<FormWrapper>{children}</FormWrapper>
		</SessionProvider>
	);
};

export default Layout;
