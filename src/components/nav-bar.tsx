import Image from "next/image";
import Link from "next/link";
import siteMetadata from "@/data/site-metadata";
import { auth } from "@/auth";
import SignIn from "@/components/sign-in";
import SignOut from "@/components/sign-out";

const NavBar = async () => {
	const session = await auth();

	return (
		<div className="navbar bg-base-100/80">
			<div className="flex-1">
				<Link href="/" className="btn btn-ghost btn-sm text-xl">
					{siteMetadata.title}
				</Link>
			</div>

			{!session?.user ? (
				<div className="flex-none">
					<SignIn />
				</div>
			) : (
				<div className="gap-2">
					<Link className="btn btn-ghost btn-sm" href="/dashboard">
						Dashboard
					</Link>

					<div className="text-sm">Welcome, {session.user.name}</div>

					<div className="avatar w-10 rounded-full border">
						<Image
							width={64}
							height={64}
							className="my-0 rounded-full"
							src={String(session.user.image)}
							alt={`${session.user.name} Avatar`}
							priority
						/>
					</div>
					<SignOut />
				</div>
			)}
		</div>
	);
};

export default NavBar;
