import { PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const Layout = async (props: PropsWithChildren) => {
	const session = await auth();

	return <SessionProvider session={session}>{props.children}</SessionProvider>;
};

export default Layout;
