import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

// TODO: Use @next/env
import * as dotenv from "dotenv";
import siteMetadata from "@/data/site-metadata";
import NavBar from "@/components/nav-bar";

dotenv.config();

export const viewport: Viewport = {
	colorScheme: "dark",
	themeColor: "#212121",
};

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
	return (
		<html lang="en">
			<body
				className={`${inter.className} prose flex max-w-none flex-col items-center`}
			>
				<div className="fixed z-50 w-full">
					<NavBar />
				</div>
				<div className="2xl:7/12 container flex w-full justify-center px-4 py-24 md:px-10 lg:w-9/12 xl:w-8/12">
					{children}
				</div>
			</body>
		</html>
	);
};

export default RootLayout;
