import signInWithDiscordAndRevalidate from "@/actions/auth/sign-in-with-discord-and-revalidate";
import { signIn } from "@/auth";
import { revalidatePath } from "next/cache";

jest.mock("@/auth", () => ({
	signIn: jest.fn(),
}));

jest.mock("next/cache", () => ({
	revalidatePath: jest.fn(),
}));

describe("signInWithDiscord", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("calls signIn with 'discord'", async () => {
		await signInWithDiscordAndRevalidate();

		expect(signIn).toHaveBeenCalledWith("discord");
	});

	it("calls revalidate with the expected arguments", async () => {
		await signInWithDiscordAndRevalidate();

		expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
	});
});
