import { MetadataRoute } from "next";

import siteMetadata from "@/data/site-metadata";

const sitemap = (): MetadataRoute.Sitemap => {
	return [
		{
			url: siteMetadata.siteUrl,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${siteMetadata.siteUrl}/plan`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
	];
};

export default sitemap;
