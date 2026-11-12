"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { LoadResult, loadWrappedData, loginUrl } from "./data";
import { Wrapped } from "./wrapped";
import { WelcomeScreen } from "@/components/Welcome";
import { Countdown, isBeforeRelease } from "@/components/Countdown";
import { WELCOME_BACKGROUND } from "./styles";

const FullscreenMessage = ({ children }: { children: React.ReactNode }) => (
	<div className="flex h-dvh w-screen flex-col items-center justify-center bg-black">
		<h1 className="font-title px-4 pt-8 text-center text-7xl text-white text-shadow-lg md:text-9xl xl:text-[12rem]">
			Blippen Wrapped
		</h1>
		<p className="mt-8 max-w-[85%] text-center font-sans text-xl text-white md:mt-16 md:max-w-6/12 md:text-3xl">
			{children}
		</p>
	</div>
);

// The release time is read once, the countdown itself does the ticking
const noSubscription = () => () => {};

const Home = () => {
	const [result, setResult] = useState<LoadResult | null>(null);
	// null while prerendering and hydrating, the static HTML can't know the time
	const beforeRelease = useSyncExternalStore(
		noSubscription,
		isBeforeRelease,
		() => null
	);
	const [countdownDone, setCountdownDone] = useState(false);
	const release = useCallback(() => setCountdownDone(true), []);
	const open =
		beforeRelease === null ? null : countdownDone || !beforeRelease;

	// Nothing is fetched before release, so nobody is sent off to log in
	// just to look at the countdown
	useEffect(() => {
		if (!open) {
			return;
		}
		loadWrappedData().then((res) => {
			if (res.status === "login") {
				window.location.href = loginUrl();
				return;
			}
			setResult(res);
		});
	}, [open]);

	if (open === false) {
		return (
			<div className={WELCOME_BACKGROUND}>
				<Countdown onDone={release} />
			</div>
		);
	}

	// Same look as the welcome slide, so the static HTML already shows it and
	// nothing jumps when the data arrives
	if (result === null) {
		return (
			<div className={WELCOME_BACKGROUND}>
				<WelcomeScreen />
			</div>
		);
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
