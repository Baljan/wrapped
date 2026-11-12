import { useWrappedContext } from "@/app/context";
import { parseDuration } from "@/app/format";
import { BODY, H1, HERO, afterAnimation } from "@/app/styles";
import {
	animate,
	motion,
	useInView,
	useMotionValue,
	useTransform
} from "motion/react";
import { useEffect, useRef } from "react";
import { Element } from "react-scroll";

const COUNT_DELAY = 0.4;
const COUNT_DURATION = 1.6;

const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");

/** Number shown while counting, and the unit after it */
const readout = (s: number) => {
	if (s < 60) {
		return s.toFixed(2).replace(".", ",");
	} else if (s < 3600) {
		return `${Math.floor(s / 60)}:${pad(s % 60)}`;
	}
	return `${Math.floor(s / 3600)}:${pad((s % 3600) / 60)}`;
};

const unit = (s: number) => (s < 60 ? "sek" : s < 3600 ? "min" : "tim");

const comment = (s: number) => {
	if (s < 60) return "Bjöd du en kompis, eller var det en sån dag?";
	if (s < 3600) return "Påtår innan föreläsningen hann börja.";
	return "Du tar ett kaffe i taget. Respekt.";
};

export const FastestRefill = () => {
	const { shortest_delta } = useWrappedContext();
	const seconds = parseDuration(shortest_delta) ?? 0;

	const ref = useRef(null);
	const isInView = useInView(ref, { once: true });
	const value = useMotionValue(0);
	const text = useTransform(value, readout);

	useEffect(() => {
		if (!isInView) return;
		const controls = animate(value, seconds, {
			delay: COUNT_DELAY,
			duration: COUNT_DURATION,
			ease: [0.1, 0.6, 0.3, 1]
		});
		return () => controls.stop();
	}, [isInView, seconds, value]);

	return (
		<Element
			name="fastest_refill"
			className="bg-baljan-pink sticky top-0 flex h-svh w-screen flex-col items-center justify-center px-6 text-white md:px-8"
		>
			<h1 className={`${H1} text-center`}>
				{seconds < 60
					? "Ditt snabbaste dubbelblipp"
					: "Din snabbaste påtår"}
			</h1>

			<p
				ref={ref}
				className="mt-6 flex items-baseline gap-2 md:mt-10 md:gap-4"
			>
				<motion.span className={`${HERO} tabular-nums`}>
					{text}
				</motion.span>
				<span className="font-sans text-2xl md:text-4xl">
					{unit(seconds)}
				</span>
			</p>

			<motion.p
				className={`${BODY} mt-6 text-center text-pink-50 md:mt-10`}
				{...afterAnimation(COUNT_DELAY + COUNT_DURATION)}
			>
				Mellan två av dina blipp. {comment(seconds)}
			</motion.p>
		</Element>
	);
};
