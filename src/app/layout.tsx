import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import * as dotenv from "dotenv";
import NavBar from "@/components/nav-bar";
dotenv.config();

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "13 Potato Salads",
	description: "A Potluck Organizer",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className} prose max-w-none`}>
				<NavBar />
				<div className="container p-10">{children}</div>
			</body>
		</html>
	);
}
