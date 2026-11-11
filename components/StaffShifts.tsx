import { useWrappedContext } from "@/app/context";
import { thisSemester } from "@/app/format";
import { motion } from "motion/react";
import { FaSun } from "react-icons/fa6";
import { Element } from "react-scroll";
import { Standout } from "./Standout";

// Where on the sky arc each part of the day sits, in degrees (180 = east)
const SPANS = [
	{ key: "morning", label: "Förmiddag", angle: 155 },
	{ key: "lunch", label: "Lunch", angle: 90 },
	{ key: "afternoon", label: "Eftermiddag", angle: 25 }
] as const;

export const StaffShifts = () => {
	const { shifts, semester } = useWrappedContext();

	if (!shifts) {
		return null;
	}

	const when = thisSemester(semester);
	const spans = SPANS.filter(
		(s) => s.key !== "lunch" || shifts.by_span.lunch > 0
	);

	return (
		<Element
			name="staff_shifts"
			className="sticky top-0 flex h-screen w-screen flex-col items-center justify-center bg-sky-600 px-8"
		>
			<h1 className="font-title text-center text-6xl text-white xl:text-7xl">
				{shifts.count > 0
					? `Du jobbade ${shifts.count} pass ${when}. Tack!`
					: `Du gick ${shifts.on_call} jourpass ${when}. Tack!`}
			</h1>

			{shifts.count > 0 && (
				<div className="relative mt-16 aspect-[2.2] w-[min(55vw,95vh)]">
					<svg
						viewBox="0 0 220 100"
						className="absolute inset-0 h-full w-full"
						aria-hidden
					>
						<path
							d="M 18 96 A 92 84 0 0 1 202 96"
							fill="none"
							strokeWidth={0.8}
							strokeDasharray="2 3"
							className="stroke-sky-200"
						/>
					</svg>
					{spans.map((s, i) => {
						const rad = (s.angle * Math.PI) / 180;
						const left = 50 + 41.8 * Math.cos(rad);
						const top = 96 - 84 * Math.sin(rad);
						const n = shifts.by_span[s.key];
						return (
							<motion.div
								key={s.key}
								className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
								style={{ left: `${left}%`, top: `${top}%` }}
								initial={{ opacity: 0, y: 80 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{
									delay: 0.6 + i * 0.6,
									type: "spring",
									bounce: 0.3,
									duration: 0.9
								}}
							>
								<FaSun
									className={
										n > 0
											? "h-20 w-20 fill-amber-300"
											: "h-20 w-20 fill-sky-400"
									}
								/>
								<span className="font-title mt-1 text-5xl text-white">
									{n}
								</span>
								<span className="font-sans text-xl text-sky-100">
									{s.label}
								</span>
							</motion.div>
						);
					})}
				</div>
			)}

			<motion.p
				className="mt-8 max-w-3xl text-center font-sans text-3xl/relaxed text-white"
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ delay: 2.6 }}
			>
				{shifts.exam_period > 0 && (
					<>
						<Standout>{shifts.exam_period}</Standout> av dem under
						tentaperioden.{" "}
					</>
				)}
				{shifts.count > 0 && shifts.on_call > 0 && (
					<>
						Dessutom <Standout>{shifts.on_call} jourpass</Standout>
						.{" "}
					</>
				)}
				Utan dig hade ingen fått något kaffe.
			</motion.p>
		</Element>
	);
};
