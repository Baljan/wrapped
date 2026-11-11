import { useWrappedContext } from "@/app/context";
import { parseDuration } from "@/app/format";
import {
	animate,
	motion,
	useInView,
	useMotionValue,
	useTransform
} from "motion/react";
import { useEffect, useRef } from "react";
import { FaStopwatch } from "react-icons/fa6";
import { Element } from "react-scroll";
import { Standout } from "./Standout";

const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");

const readout = (s: number) => {
	if (s < 60) {
		return `${pad(s)},${pad((s % 1) * 100)}`;
	} else if (s < 3600) {
		return `${pad(s / 60)}:${pad(s % 60)}`;
	}
	return `${Math.floor(s / 3600)}:${pad((s % 3600) / 60)}:${pad(s % 60)}`;
};

const inWords = (s: number) => {
	if (s < 60) {
		return `${s.toFixed(1).replace(".", ",")} sekunder`;
	} else if (s < 3600) {
		const m = Math.round(s / 60);
		return `${m} ${m === 1 ? "minut" : "minuter"}`;
	}
	const h = Math.round(s / 360) / 10;
	return `${String(h).replace(".", ",")} timmar`;
};

const comment = (s: number) => {
	if (s < 10) return "Hann du ens dricka upp den första?";
	if (s < 60) return "Under en minut mellan två koppar. Snyggt.";
	if (s < 3600) return "Det kallar vi fokus.";
	return "Du tar det lugnt mellan kopparna, och det gillar vi.";
};

export const FastestRefill = () => {
	const { shortest_delta } = useWrappedContext();
	const seconds = parseDuration(shortest_delta) ?? 0;

	const ref = useRef(null);
	const isInView = useInView(ref);
	const value = useMotionValue(0);
	const text = useTransform(value, readout);

	useEffect(() => {
		if (!isInView) return;
		value.set(0);
		const controls = animate(value, seconds, {
			delay: 0.6,
			duration: 1.6,
			ease: [0.1, 0.6, 0.3, 1]
		});
		return () => controls.stop();
	}, [isInView, seconds, value]);

	return (
		<Element
			name="fastest_refill"
			className="sticky top-0 flex h-screen w-screen flex-col items-center justify-center bg-red-600 px-8"
		>
			<h1 className="font-title text-center text-6xl text-white xl:text-7xl">
				Din snabbaste påtår
			</h1>

			<div ref={ref} className="mt-12 flex items-center gap-8">
				<motion.div
					initial={{ rotate: 0 }}
					whileInView={{ rotate: [0, -12, 12, -6, 6, 0] }}
					transition={{ delay: 2.2, duration: 0.5 }}
				>
					<FaStopwatch className="h-36 w-36 fill-white xl:h-48 xl:w-48" />
				</motion.div>
				<motion.span className="text-[9rem] font-bold text-white tabular-nums xl:text-[12rem]">
					{text}
				</motion.span>
			</div>

			<motion.p
				className="mt-8 max-w-3xl text-center font-sans text-3xl/relaxed text-white"
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ delay: 2.6 }}
			>
				Bara <Standout>{inWords(seconds)}</Standout> mellan två blipp.
				<br />
				{comment(seconds)}
			</motion.p>
		</Element>
	);
};
