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
	title: siteMetadata.title,
	description: siteMetadata.description,
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
					<NavBar />
					<div className="container flex w-full justify-center px-4 pt-12 md:w-10/12 md:px-10">
						{children}
					</div>
				</SessionProvider>
			</body>
		</html>
	);
};

export default RootLayout;
