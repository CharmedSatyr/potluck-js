jest.mock("next/navigation", () => ({
	redirect: jest.fn(),
}));

describe("Page component", () => {
	it.todo("should call redirect with the correct path");
});
