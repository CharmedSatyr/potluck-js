import signInWithDiscord from "@/actions/auth/sign-in-with-discord";
import { signIn } from "@/auth";

jest.mock("@/auth", () => ({
	signIn: jest.fn(),
}));

describe("signInWithDiscord", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("calls signIn with 'discord'", async () => {
		await signInWithDiscord();

		expect(signIn).toHaveBeenCalledWith("discord");
	});
});
