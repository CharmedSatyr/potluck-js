import buildCurrentUrl from "@/utilities/build-current-url";

jest.mock("@/data/site-metadata", () => ({
	siteUrl: "https://example.com",
}));

describe("buildCurrentUrl", () => {
	afterAll(() => {
		jest.clearAllMocks();
	});

	it("should return the correct URL for development environment", () => {
		const pathName = "/test-path";
		const env = "development";
		const port = "4000";

		const url = buildCurrentUrl(pathName, env, port);

		expect(url).toBe(`http://localhost:${port}${pathName}`);
	});

	it("should return the correct URL for production environment", () => {
		const pathName = "/test-path";
		const env = "production";

		const url = buildCurrentUrl(pathName, env);

		expect(url).toBe(`https://example.com${pathName}`);
	});

	it("should return the correct URL when no port is provided in development", () => {
		const pathName = "/test-path";
		const env = "development";

		const url = buildCurrentUrl(pathName, env);

		expect(url).toBe(`http://localhost:3000${pathName}`);
	});
});
