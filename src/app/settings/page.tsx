type Props = {
	params: Promise<{ code: string }>;
	searchParams: Promise<{ [key: string]: string }>;
};

const SettingsPage = async ({ searchParams }: Props) => {
	const params = await searchParams;
	const setup = params["setup"];

	/*
	const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const allTimezoneValues = Intl.supportedValuesOf("timeZone");
	*/

	return (
		<section className="w-full">
			<h1 className="text-primary">Settings</h1>
			{setup && <h2>Initial setup Complete! You may return to Discord.</h2>}
			<p></p>
			<p>
				All events will default to the{" "}
				<span className="font-bold">America/Los_Angeles</span> timezone for now.
			</p>
			<p>Check back soon for additional timezone support and other settings.</p>
		</section>
	);
};

export default SettingsPage;
