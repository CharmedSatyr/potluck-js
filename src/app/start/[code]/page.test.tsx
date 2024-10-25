import { render } from "@testing-library/react";
import Page from "@/app/start/[code]/page";
import { redirect } from "next/navigation";

jest.mock("next/navigation", () => ({
	redirect: jest.fn(),
}));

describe("Page component", () => {
	it("should call redirect with the correct path", () => {
		render(<Page />);

		expect(redirect).toHaveBeenCalledWith("/start/create-event");
	});
});
