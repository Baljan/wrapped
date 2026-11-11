import { useWrappedContext } from "@/app/context";
import { weekdayName, weekdayShort } from "@/app/format";
import clsx from "clsx";
import { motion } from "motion/react";
import { Element } from "react-scroll";
import { Standout } from "./Standout";

const INNER = 100;
const MAX_BAR = 80;

const polar = (r: number, hour: number) => {
	const a = (hour / 24) * 2 * Math.PI - Math.PI / 2;
	return [r * Math.cos(a), r * Math.sin(a)];
};

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
		text: "Du laddar inför kvällsplugget."
	};
};

export const Clock = () => {
	const { time_of_day } = useWrappedContext();

	if (!time_of_day) {
		return null;
	}

	const { hours, weekdays, fav_hour, fav_weekday } = time_of_day;
	const max = Math.max(...hours, 1);
	const p = persona(fav_hour);
	const shownDays = weekdays
		.map((count, i) => ({ count, i }))
		.filter(({ count, i }) => i < 5 || count > 0);

	return (
		<Element
			name="clock"
			className="sticky top-0 flex h-screen w-screen items-center justify-center gap-16 bg-violet-800 px-12"
		>
			<div className="relative aspect-square w-[min(75vh,45vw)] shrink-0">
				<svg viewBox="-200 -200 400 400" className="h-full w-full">
					<circle
						r={INNER - 8}
						className="fill-violet-900 stroke-violet-600"
						strokeWidth={2}
					/>
					{hours.map((count, h) => {
						const len = (count / max) * MAX_BAR;
						if (len === 0) return null;
						const [x1, y1] = polar(INNER, h + 0.5);
						const [x2, y2] = polar(INNER + len, h + 0.5);
						return (
							<motion.line
								key={h}
								x1={x1}
								y1={y1}
								x2={x2}
								y2={y2}
								strokeWidth={18}
								strokeLinecap="round"
								className={
									h === fav_hour
										? "stroke-amber-300"
										: "stroke-violet-300"
								}
								initial={{ pathLength: 0 }}
								whileInView={{ pathLength: 1 }}
								transition={{
									delay: 0.4 + h * 0.03,
									duration: 0.6
								}}
							/>
						);
					})}
					{[0, 6, 12, 18].map((h) => {
						const [x, y] = polar(INNER - 30, h);
						return (
							<text
								key={h}
								x={x}
								y={y}
								textAnchor="middle"
								dominantBaseline="central"
								className="fill-violet-300 font-sans text-[18px]"
							>
								{String(h).padStart(2, "0")}
							</text>
						);
					})}
				</svg>
				{/* The hand spins in and lands on the favorite hour */}
				<motion.div
					className="absolute inset-0"
					initial={{ rotate: -720 }}
					whileInView={{ rotate: ((fav_hour + 0.5) / 24) * 360 }}
					transition={{
						delay: 0.8,
						duration: 2.2,
						ease: [0.2, 0.8, 0.3, 1]
					}}
				>
					<svg viewBox="-200 -200 400 400" className="h-full w-full">
						<line
							x1={0}
							y1={0}
							x2={0}
							y2={-(INNER - 12)}
							strokeWidth={8}
							strokeLinecap="round"
							className="stroke-white"
						/>
						<circle r={12} className="fill-white" />
					</svg>
				</motion.div>
			</div>

			<div className="flex max-w-2xl flex-col items-start">
				<motion.h2
					className="font-sans text-3xl text-violet-100"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
				>
					Mellan <Standout>{fav_hour}</Standout> och{" "}
					<Standout>{fav_hour + 1}</Standout> blippade du som mest.
				</motion.h2>
				<motion.h1
					className="font-title mt-2 text-6xl text-white xl:text-7xl"
					initial={{ opacity: 0, scale: 0.8 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ delay: 3, type: "spring", bounce: 0.4 }}
				>
					{p.name}
				</motion.h1>
				<motion.p
					className="mt-4 font-sans text-3xl/relaxed text-violet-100"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ delay: 3.5 }}
				>
					{p.text}
				</motion.p>

				<motion.div
					className="mt-12 flex gap-3"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ delay: 4.2 }}
				>
					{shownDays.map(({ count, i }) => (
						<div
							key={i}
							className={clsx(
								"flex w-20 flex-col items-center rounded-2xl py-3 font-sans",
								i === fav_weekday
									? "bg-white text-violet-800"
									: "bg-violet-700 text-violet-200"
							)}
						>
							<span className="text-lg">{weekdayShort(i)}</span>
							<span className="text-2xl font-bold">{count}</span>
						</div>
					))}
				</motion.div>
				<motion.p
					className="mt-4 font-sans text-2xl text-violet-100"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ delay: 4.6 }}
				>
					{fav_weekday === 4
						? "Fredagsfikaren! Ingen helg utan en kopp först."
						: `${weekdayName(fav_weekday)[0].toUpperCase()}${weekdayName(fav_weekday).slice(1)}ar var din kaffedag.`}
				</motion.p>
			</div>
		</Element>
	);
};
