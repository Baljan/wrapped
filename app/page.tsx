"use client";

import { useEffect, useState } from "react";
import { LoadResult, loadWrappedData, loginUrl } from "./data";
import { Wrapped } from "./wrapped";

const FullscreenMessage = ({ children }: { children?: React.ReactNode }) => (
	<div className="flex h-screen w-screen flex-col items-center justify-center bg-black">
		<h1 className="font-title px-4 pt-8 text-center text-7xl text-white text-shadow-lg md:text-9xl xl:text-[12rem]">
			Blippen Wrapped
		</h1>
		{children && (
			<p className="mt-16 max-w-6/12 text-center font-sans text-3xl text-white">
				{children}
			</p>
		)}
	</div>
);

const Home = () => {
	const [result, setResult] = useState<LoadResult | null>(null);

	useEffect(() => {
		loadWrappedData().then((res) => {
			if (res.status === "login") {
				window.location.href = loginUrl();
				return;
			}
			setResult(res);
		});
	}, []);

	if (result === null) {
		return <FullscreenMessage />;
	}

	if (result.status === "no-data") {
		return (
			<FullscreenMessage>
				<i>Sorgens dag.</i>
				<br />
				<br />
				Det plågar oss att säga, men du har inte blippat någon gång den
				här terminen, så vi har ingen data för dig.
			</FullscreenMessage>
		);
	}

	if (result.status === "error") {
		return (
			<FullscreenMessage>
				Något gick snett när vi hämtade din data. Testa att ladda om
				sidan om en stund.
			</FullscreenMessage>
		);
	}

	return <Wrapped data={result.data} />;
};

export default Home;
