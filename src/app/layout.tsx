import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

import * as dotenv from "dotenv";
import NavBar from "@/components/nav-bar";
import siteMetadata from "@/data/site-metadata";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

dotenv.config();

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	description: siteMetadata.description,
	title: siteMetadata.title,
};

const RootLayout = async ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	const session = await auth();

	return (
		<html lang="en">
			<body
				className={`${inter.className} prose flex max-w-none flex-col items-center`}
			>
				<SessionProvider session={session}>
					<div className="fixed w-full">
						<NavBar />
					</div>
					<div className="container flex w-full justify-center px-4 pt-24 md:w-10/12 md:px-10">
						{children}
					</div>
				</SessionProvider>
			</body>
		</html>
	);
};

export default RootLayout;
