import { redirect } from "next/navigation";
import { render } from "@testing-library/react";
import Page from "@/app/start/page";

jest.mock("next/navigation", () => ({
	redirect: jest.fn(),
}));

describe("Page component", () => {
	it.todo("should call redirect with the correct path");
});
