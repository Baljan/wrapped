import { useWrappedContext } from "@/app/context";
import { weekdayName } from "@/app/format";
import { BODY, H1, afterAnimation } from "@/app/styles";
import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { Element } from "react-scroll";
import { Standout } from "./Standout";

// The cafés open around seven, so that's where the hands start
const OPENING_HOUR = 7;
const SWEEP_DELAY = 0.4;
const sweepDuration = (hours: number) => 1 + hours * 0.3;

const persona = (hour: number) => {
	if (hour < 10) {
		return {
			name: "Morgonpigg",
			text: "Kaffet kommer före första föreläsningen."
		};
	} else if (hour < 13) {
		return {
			name: "Lunchkaffaren",
			text: "Ingen lunch utan en kopp efteråt."
		};
	} else if (hour < 16) {
		return {
			name: "Eftermiddagsfikaren",
			text: "Eftermiddagsdippen har inte en chans."
		};
	}
	return {
		name: "Kvällsugglan",
		text: "Kaffe till kvällsplugget."
	};
};

/** Pie slice on the dial covering one hour, from `hour` to `hour + 1`. */
const hourWedge = (hour: number, r: number) => {
	const a0 = ((hour % 12) / 12) * 2 * Math.PI;
	const a1 = (((hour % 12) + 1) / 12) * 2 * Math.PI;
	const p = (a: number) =>
		`${(Math.sin(a) * r).toFixed(2)} ${(-Math.cos(a) * r).toFixed(2)}`;
	return `M 0 0 L ${p(a0)} A ${r} ${r} 0 0 1 ${p(a1)} Z`;
};

/**
 * A plain analog wall clock. The hands run from opening time to the middle
 * of the favorite hour, which is marked on the dial.
 */
const WallClock = ({ hour }: { hour: number }) => {
	const ref = useRef(null);
	const hourHand = useRef<SVGGElement>(null);
	const minuteHand = useRef<SVGGElement>(null);
	const isInView = useInView(ref, { once: true });
	const from = Math.min(OPENING_HOUR, hour);
	const to = hour + 0.5;

	useEffect(() => {
		if (!isInView) return;
		const controls = animate(from, to, {
			delay: SWEEP_DELAY,
			duration: sweepDuration(to - from),
			ease: [0.3, 0, 0.2, 1],
			onUpdate: (h) => {
				hourHand.current?.setAttribute(
					"transform",
					`rotate(${(h % 12) * 30})`
				);
				minuteHand.current?.setAttribute(
					"transform",
					`rotate(${(h % 1) * 360})`
				);
			}
		});
		return () => controls.stop();
	}, [isInView, from, to]);

	return (
		<svg
			ref={ref}
			viewBox="-110 -110 220 220"
			className="h-full w-full drop-shadow-[0_18px_30px_rgba(10,10,50,0.45)]"
			role="img"
			aria-label={`En klocka där timmen mellan ${hour} och ${hour + 1} är markerad`}
		>
			<circle r={106} className="fill-[#1d1e5c]" />
			<circle r={98} className="fill-white" />

			<motion.path
				d={hourWedge(hour, 98)}
				className="fill-baljan-pink/20"
				initial={{ opacity: 0 }}
				animate={isInView ? { opacity: 1 } : undefined}
				transition={{
					delay: SWEEP_DELAY + sweepDuration(to - from) - 0.3,
					duration: 0.4
				}}
			/>

			{Array.from({ length: 60 }, (_, i) => {
				const major = i % 5 === 0;
				return (
					<line
						key={i}
						x1={0}
						y1={-92}
						x2={0}
						y2={major ? -82 : -88}
						strokeWidth={major ? 3 : 1}
						strokeLinecap="round"
						className="stroke-baljan-dark-blue"
						transform={`rotate(${i * 6})`}
					/>
				);
			})}

			{Array.from({ length: 12 }, (_, i) => {
				const n = i === 0 ? 12 : i;
				const a = (i / 12) * 2 * Math.PI;
				return (
					<text
						key={n}
						x={Math.sin(a) * 68}
						y={-Math.cos(a) * 68}
						textAnchor="middle"
						dominantBaseline="central"
						className="fill-baljan-dark-blue text-[17px] font-bold"
					>
						{n}
					</text>
				);
			})}

			{/* Both hands stay inside the numerals so they never cover one */}
			<g ref={minuteHand} transform="rotate(0)">
				<line
					x1={0}
					y1={10}
					x2={0}
					y2={-56}
					strokeWidth={4}
					strokeLinecap="round"
					className="stroke-baljan-dark-blue"
				/>
			</g>
			<g ref={hourHand} transform={`rotate(${(from % 12) * 30})`}>
				<line
					x1={0}
					y1={8}
					x2={0}
					y2={-40}
					strokeWidth={7}
					strokeLinecap="round"
					className="stroke-baljan-pink"
				/>
			</g>
			<circle r={6} className="fill-baljan-pink" />
		</svg>
	);
};

export const Clock = () => {
	const { time_of_day } = useWrappedContext();

	if (!time_of_day) {
		return null;
	}

	const { fav_hour, fav_weekday } = time_of_day;
	const p = persona(fav_hour);
	const day = weekdayName(fav_weekday);
	const done =
		SWEEP_DELAY +
		sweepDuration(fav_hour + 0.5 - Math.min(OPENING_HOUR, fav_hour));

	return (
		<Element
			name="clock"
			className="bg-baljan-dark-blue sticky top-0 flex h-svh w-screen flex-col items-center justify-center gap-8 px-6 text-white md:flex-row md:gap-20 md:px-12"
		>
			<div className="aspect-square w-[min(36svh,72vw)] shrink-0 md:w-[min(62vh,38vw)]">
				<WallClock hour={fav_hour} />
			</div>

			<div className="flex flex-col items-center text-center md:items-start md:text-left">
				<p className="font-sans text-lg text-indigo-100 md:text-3xl">
					Mellan <Standout>{fav_hour}</Standout> och{" "}
					<Standout>{fav_hour + 1}</Standout> blippade du mest.
				</p>
				<h1 className={`${H1} mt-2 md:mt-3`}>{p.name}</h1>
				<motion.p
					className={`${BODY} mt-3 text-indigo-100 md:mt-4`}
					{...afterAnimation(done)}
				>
					{p.text}{" "}
					{fav_weekday === 4
						? "Och fredagar var din kaffedag, helgen börjar med en kopp."
						: `Och ${day}ar var din kaffedag.`}
				</motion.p>
			</div>
		</Element>
	);
};
