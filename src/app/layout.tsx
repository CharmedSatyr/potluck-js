import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import * as dotenv from "dotenv";
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
			<body className={`${inter.className} prose max-w-none p-20`}>
				{children}
			</body>
		</html>
	);
}
