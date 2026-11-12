import { motion } from "motion/react";
import { useEffect, useState } from "react";

/** When the wrapped opens: 1 December, 08.00 Swedish time */
export const RELEASE_AT = new Date("2026-12-01T08:00:00+01:00");

/**
 * Whether to hold the wrapped back behind the countdown. Only a frontend
 * gate, the data endpoint answers either way.
 * ?preview skips it in production, ?countdown shows it during `npm run dev`.
 */
export const isBeforeRelease = () => {
	const params = new URLSearchParams(window.location.search);
	if (process.env.NODE_ENV !== "production" && !params.has("countdown")) {
		return false;
	}
	return !params.has("preview") && Date.now() < RELEASE_AT.getTime();
};

const UNITS = [
	{ ms: 86_400_000, one: "dag", many: "dagar" },
	{ ms: 3_600_000, one: "timme", many: "timmar" },
	{ ms: 60_000, one: "minut", many: "minuter" },
	{ ms: 1_000, one: "sekund", many: "sekunder" }
];

const split = (msLeft: number) => {
	let rest = Math.max(msLeft, 0);
	return UNITS.map((unit) => {
		const value = Math.floor(rest / unit.ms);
		rest -= value * unit.ms;
		return { value, label: value === 1 ? unit.one : unit.many };
	});
};

/** Full-screen countdown on the welcome gradient, calls onDone at zero */
export const Countdown = ({ onDone }: { onDone: () => void }) => {
	const [now, setNow] = useState(() => Date.now());
	const msLeft = RELEASE_AT.getTime() - now;

	useEffect(() => {
		if (msLeft <= 0) {
			onDone();
			return;
		}
		// Tick on the second boundary so the seconds don't drift
		const timeout = setTimeout(
			() => setNow(Date.now()),
			msLeft % 1000 || 1000
		);
		return () => clearTimeout(timeout);
	}, [msLeft, onDone]);

	return (
		<div className="flex h-dvh w-screen flex-col items-center justify-center px-4 text-white">
			<h1 className="font-title text-center text-7xl text-shadow-lg md:text-9xl xl:text-[12rem]">
				Blippen Wrapped
			</h1>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.3 }}
				className="mt-10 flex flex-col items-center md:mt-16"
			>
				<p className="font-sans text-xl font-bold text-shadow-lg md:text-3xl">
					Släpps om
				</p>
				<div className="mt-4 grid grid-cols-4 gap-2 md:mt-8 md:gap-6">
					{split(msLeft).map(({ value, label }) => (
						<div
							key={label}
							className="flex w-[4.75rem] flex-col items-center rounded-2xl bg-black/20 py-3 backdrop-blur-sm md:w-36 md:py-5"
						>
							<span className="font-title text-4xl/none tabular-nums md:text-7xl/none">
								{String(value).padStart(2, "0")}
							</span>
							<span className="mt-1.5 font-sans text-xs md:mt-3 md:text-lg">
								{label}
							</span>
						</div>
					))}
				</div>
				<p className="mt-8 font-sans text-lg opacity-90 md:mt-12 md:text-2xl">
					1 december kl. 08.00
				</p>
			</motion.div>
		</div>
	);
};
