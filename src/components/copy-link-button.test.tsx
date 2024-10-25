import { render, screen, fireEvent, act } from "@testing-library/react";
import CopyLinkButton from "@/components/copy-link-button";
import buildCurrentUrl from "@/utilities/build-current-url";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
	usePathname: jest.fn(),
}));

jest.mock("@/utilities/build-current-url", () => jest.fn());

describe("CopyLinkButton", () => {
	beforeAll(() => {
		jest.useFakeTimers();

		Object.defineProperty(navigator, "clipboard", {
			value: {
				writeText: jest.fn(),
			},
			writable: true,
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.clearAllTimers();
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	beforeEach(() => {
		(usePathname as jest.Mock).mockReturnValue("/sample-path");
		(buildCurrentUrl as jest.Mock).mockReturnValue(
			"http://example.com/sample-path"
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("renders with default text and icon", () => {
		render(<CopyLinkButton />);

		expect(screen.getByText("Copy Link")).toBeInTheDocument();
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("copies the URL to the clipboard and shows 'Copied' text on click", async () => {
		render(<CopyLinkButton />);

		act(() => {
			fireEvent.click(screen.getByRole("button"));
		});

		expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
			"http://example.com/sample-path"
		);
		expect(screen.getByText("Copied")).toBeInTheDocument();
	});

	it("resets to 'Copy Link' text after timeout", async () => {
		render(<CopyLinkButton />);

		act(() => {
			fireEvent.click(screen.getByRole("button"));

			jest.runAllTimers();
		});

		expect(screen.getByText("Copy Link")).toBeInTheDocument();
	});
});
