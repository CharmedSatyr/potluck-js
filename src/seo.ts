import { Metadata } from "next";

import siteMetadata from "@/data/site-metadata";

interface PageSEOProps {
	title: string;
	description?: string;
	image?: string;
	[key: string]: unknown;
}

const genPageMetadata = ({
	title,
	description,
	image,
	...rest
}: PageSEOProps): Metadata => ({
	title,
	openGraph: {
		title: `${title} | ${siteMetadata.title}`,
		description: description ?? siteMetadata.description,
		url: "./",
		siteName: siteMetadata.title,
		images: image ? [image] : [],
		locale: "en_US",
		type: "website",
	},
	...rest,
});

export default genPageMetadata;
