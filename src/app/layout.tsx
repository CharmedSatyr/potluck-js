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
				<div className="container flex w-full justify-center px-4 pt-12 md:w-10/12 md:px-10">
					{children}
				</div>
			</body>
		</html>
	);
}
