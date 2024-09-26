import siteMetadata from "@/data/site-metadata";

const buildCurrentUrl = (pathName: string): string => {
	const urlBase =
		process.env.NODE_ENV === "development"
			? `http://localhost:${process.env.PORT ?? 3000}`
			: siteMetadata.siteUrl;

	return urlBase.concat(pathName);
};

export default buildCurrentUrl;
