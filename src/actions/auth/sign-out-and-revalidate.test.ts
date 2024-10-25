import signOutAndRevalidate from "@/actions/auth/sign-out-and-revalidate";
import { signOut } from "@/auth";
import { revalidatePath } from "next/cache";

jest.mock("@/auth", () => ({
	signOut: jest.fn(),
}));

jest.mock("next/cache", () => ({
	revalidatePath: jest.fn(),
}));

describe("signOutAndRevalidate", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("calls signOut with redirectTo '/'", async () => {
		await signOutAndRevalidate();

		expect(signOut).toHaveBeenCalledWith({ redirectTo: "/" });
	});

	it("calls revalidatePath with '/' and 'layout'", async () => {
		await signOutAndRevalidate();

		expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
	});

	it("calls signOut before revalidatePath", async () => {
		const signOutMock = signOut as jest.Mock;
		const revalidateMock = revalidatePath as jest.Mock;

		await signOutAndRevalidate();

		expect(signOutMock.mock.invocationCallOrder[0]).toBeLessThan(
			revalidateMock.mock.invocationCallOrder[0]
		);
	});
});
