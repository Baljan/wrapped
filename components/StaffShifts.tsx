import { useWrappedContext } from "@/app/context";
import { thisSemester } from "@/app/format";
import { BODY, H1, afterAnimation } from "@/app/styles";
import { motion } from "motion/react";
import { Element } from "react-scroll";
import { Standout } from "./Standout";

// Sky drawn in a 220 x 115 box, horizon at y = 95
const HORIZON = 95;
const CX = 110;
const RX = 92;
const RY = 78;
const RISE_DELAY = 0.4;
const RISE_SPACING = 0.5;

// Where on the arc each part of the day sits, in degrees (180 = east)
const SPANS = [
	{ key: "morning", label: "Förmiddag", angle: 152 },
	{ key: "lunch", label: "Lunch", angle: 90 },
	{ key: "afternoon", label: "Eftermiddag", angle: 28 }
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
	const done = RISE_DELAY + spans.length * RISE_SPACING + 0.6;

	return (
		<Element
			name="staff_shifts"
			className="bg-baljan-blue sticky top-0 flex h-svh w-screen flex-col items-center justify-center px-6 text-white md:px-8"
		>
			<h1 className={`${H1} text-center`}>
				{shifts.count > 0
					? `${shifts.count} pass bakom disken ${when}`
					: `${shifts.on_call} jourpass ${when}`}
			</h1>

			{shifts.count > 0 && (
				<svg
					viewBox="0 0 220 115"
					className="mt-6 w-[min(85vw,42svh)] overflow-visible md:mt-8 md:w-[min(50vw,65vh)]"
					role="img"
					aria-label={spans
						.map((s) => `${s.label}: ${shifts.by_span[s.key]} pass`)
						.join(", ")}
				>
					<defs>
						<clipPath id="sky">
							<rect
								x={-20}
								y={-40}
								width={260}
								height={HORIZON + 40}
							/>
						</clipPath>
					</defs>
					<path
						d={`M ${CX - RX} ${HORIZON} A ${RX} ${RY} 0 0 1 ${CX + RX} ${HORIZON}`}
						fill="none"
						strokeWidth={0.8}
						strokeDasharray="2 3"
						className="stroke-sky-100/70"
					/>
					<line
						x1={0}
						y1={HORIZON}
						x2={220}
						y2={HORIZON}
						strokeWidth={1.2}
						className="stroke-white"
					/>

					<g clipPath="url(#sky)">
						{spans.map((s, i) => {
							const rad = (s.angle * Math.PI) / 180;
							const x = CX + RX * Math.cos(rad);
							const y = HORIZON - RY * Math.sin(rad);
							const n = shifts.by_span[s.key];
							const r = Math.min(8 + n * 2.5, 22);
							return (
								<motion.g
									key={s.key}
									initial={{ y: HORIZON - y + r }}
									whileInView={{ y: 0 }}
									viewport={{ once: true }}
									transition={{
										delay: RISE_DELAY + i * RISE_SPACING,
										duration: 1,
										ease: [0.2, 0.7, 0.3, 1]
									}}
								>
									<circle
										cx={x}
										cy={y}
										r={r}
										className="fill-amber-300"
									/>
									<text
										x={x}
										y={y}
										textAnchor="middle"
										dominantBaseline="central"
										className="font-title fill-sky-900"
										style={{ fontSize: Math.max(r, 10) }}
									>
										{n}
									</text>
								</motion.g>
							);
						})}
					</g>

					{spans.map((s) => {
						const x = CX + RX * Math.cos((s.angle * Math.PI) / 180);
						return (
							<text
								key={s.key}
								x={x}
								y={HORIZON + 11}
								textAnchor="middle"
								className="fill-white font-sans text-[9px] md:text-[7px]"
							>
								{s.label}
							</text>
						);
					})}
				</svg>
			)}

			<motion.p
				className={`${BODY} mt-6 text-center md:mt-8`}
				{...afterAnimation(shifts.count > 0 ? done : 0.6)}
			>
				{shifts.exam_period > 0 && (
					<>
						<Standout>{shifts.exam_period}</Standout> av dem under
						tekfaktentaperioden.{" "}
					</>
				)}
				{shifts.count > 0 && shifts.on_call > 0 && (
					<>
						Plus <Standout>{shifts.on_call} jourpass</Standout>
						.{" "}
					</>
				)}
				Någon måste ju koka kaffet.
			</motion.p>
		</Element>
	);
};
