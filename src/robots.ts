import { MetadataRoute } from "next";

import siteMetadata from "@/data/site-metadata";

const robots = (): MetadataRoute.Robots => {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		host: siteMetadata.siteUrl,
	};
};

export default robots;
