import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import SignIn from "@/components/sign-in";
import SignOut from "@/components/sign-out";

const NavBar = async () => {
	const session = await auth();

	if (!session?.user) {
		return (
			<div className="navbar">
				<div className="flex-1">
					<Link href="/" className="btn btn-ghost text-xl">
						13 Potato Salads
					</Link>
				</div>
				<div className="flex-none">
					<SignIn />
				</div>
			</div>
		);
	}

	return (
		<div className="navbar">
			<div className="flex-1">
				<Link href="/" className="btn btn-ghost text-xl">
					13 Potato Salads
				</Link>
			</div>

			<div className="gap-2">
				<div>Welcome, {session.user.name}</div>
				<div className="avatar w-12">
					<Image
						width={128}
						height={128}
						className="my-0 rounded-full"
						src={session.user.image ?? ""}
						alt="User Avatar"
						priority
					/>
				</div>
				<SignOut />
			</div>
		</div>
	);
};

export default NavBar;
