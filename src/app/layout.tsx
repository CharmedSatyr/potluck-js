import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import * as dotenv from "dotenv";
import NavBar from "@/components/nav-bar";
import siteMetadata from "@/data/site-metadata";
dotenv.config();

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: siteMetadata.title,
	description: siteMetadata.description,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${inter.className} prose flex max-w-none flex-col items-center`}
			>
				<NavBar />
				<div className="container w-full md:w-3/4 px-4 md:px-10 flex justify-center pt-12">{children}</div>
			</body>
		</html>
	);
}
