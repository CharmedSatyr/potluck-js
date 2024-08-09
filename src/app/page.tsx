import Link from "next/link";

const Home = () => {
	return (
		<main>
			<h1>13 Potato Salads</h1>
			<h2>a potluck planning app</h2>

			<Link href="/create-party" className="btn">
				Click here to start a party!
			</Link>
		</main>
	);
};

export default Home;
