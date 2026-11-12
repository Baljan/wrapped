import { useWrappedContext } from "@/app/context";
import { semesterName, semesterShort } from "@/app/format";
import { BODY, H1, afterAnimation } from "@/app/styles";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Image from "next/image";
import { Element } from "react-scroll";

const PRINT_DELAY = 0.6;
const PRINT_DURATION = 2;

// Torn-paper edge along the bottom of the receipt
const TEETH = 18;
const zigzag = `polygon(0 0, 100% 0, ${Array.from(
	{ length: TEETH * 2 + 1 },
	(_, i) =>
		`${(100 - (i / (TEETH * 2)) * 100).toFixed(2)}% ${i % 2 === 0 ? "100%" : "calc(100% - 10px)"}`
).join(", ")})`;

const Row = ({
	label,
	value,
	strong
}: {
	label: string;
	value: string;
	strong?: boolean;
}) => (
	<div
		className={`font-title flex items-baseline gap-2 md:gap-3 ${strong ? "text-2xl md:text-4xl" : "text-xl md:text-3xl"}`}
	>
		<span className="first-letter:uppercase">{label}</span>
		<span className="mb-1.5 flex-1 border-b-2 border-dotted border-current/30 md:mb-2" />
		<span className="tabular-nums">{value}</span>
	</div>
);

export const Comparison = () => {
	const { n_orders, previous, semester } = useWrappedContext();
	const till = useRef(null);
	const printed = useInView(till, { once: true });

	if (!previous || previous.n_orders === 0) {
		return null;
	}

	const prev = previous.n_orders;
	const prevName = semesterName(previous.semester);
	const diff = n_orders - prev;
	const pct = Math.round((Math.abs(diff) / prev) * 100);
	const signedPct = `${diff >= 0 ? "+" : "−"}${pct} %`;

	// The receipt carries the numbers, the headline just says what happened
	let title: string;
	let text: string;
	if (diff > 0) {
		title = `Mer kaffe än ${prevName}`;
		text = "Lock in season?";
	} else if (diff < 0) {
		title = `Lugnare än ${prevName}`;
		text = "Sov du mer i år?";
	} else {
		title = `Exakt lika mycket kaffe som ${prevName}`;
		text = "Du är en vanemänniska.";
	}

	return (
		<Element
			name="comparison"
			className="bg-caramel sticky top-0 flex h-svh w-screen flex-col items-center justify-center gap-4 px-6 md:flex-row md:gap-24 md:px-12"
		>
			<div className="flex flex-col items-center text-center text-white md:items-start md:text-left">
				<h1 className={`${H1} max-w-[14ch]`}>{title}</h1>
				<motion.p
					className={`${BODY} mt-2 text-orange-50 md:mt-6`}
					{...afterAnimation(PRINT_DELAY + PRINT_DURATION)}
				>
					{text}
				</motion.p>
			</div>

			{/* The receipt is printed out of a till slot */}
			<div
				ref={till}
				className="flex shrink-0 flex-col items-center md:[@media(max-height:700px)]:scale-[0.85]"
			>
				<div className="relative z-10 h-4 w-[19rem] rounded-full bg-[#4a2509] shadow-[inset_0_4px_6px_rgba(0,0,0,0.5)] md:h-5 md:w-[32rem]" />
				<div className="-mt-2 overflow-hidden px-10 pb-14 md:-mt-2.5 md:px-8 md:pb-10">
					<motion.div
						// clip-path would cut off a box-shadow, so the shadow is a filter
						// on this wrapper and the torn edge is clipped on the paper inside
						className="drop-shadow-[0_18px_22px_rgba(67,20,7,0.35)]"
						initial={{ y: "-101%" }}
						animate={printed ? { y: 0 } : undefined}
						transition={{
							delay: PRINT_DELAY,
							duration: PRINT_DURATION,
							ease: [0.6, 0, 0.4, 1]
						}}
					>
						<div
							className="w-[16.5rem] bg-white px-5 pt-5 pb-7 text-[#3b1d07] md:w-[28rem] md:px-9 md:pt-8 md:pb-10"
							style={{ clipPath: zigzag }}
						>
							<div className="flex flex-col items-center">
								<Image
									src="/baljan_logga.png"
									alt="Baljan"
									width={881}
									height={881}
									className="h-12 w-12 opacity-80 contrast-150 grayscale md:h-20 md:w-20"
								/>
								<p className="font-title mt-1 text-3xl md:mt-2 md:text-5xl">
									Kvitto
								</p>
								<p className="mt-1 font-sans text-sm opacity-60 md:text-xl">
									{semesterShort(previous.semester)} mot{" "}
									{semesterShort(semester)}
								</p>
							</div>

							<div className="mt-4 flex flex-col gap-2 md:mt-7 md:gap-3">
								<Row label={prevName} value={`${prev} st`} />
								<Row
									label={semesterName(semester)}
									value={`${n_orders} st`}
								/>
							</div>

							<div className="my-3 border-t-2 border-dashed border-current opacity-30 md:my-5" />

							<Row
								label="Skillnad"
								value={`${diff >= 0 ? "+" : "−"}${Math.abs(diff)} st`}
								strong
							/>

							<p className="font-title mt-3 text-center text-6xl md:mt-6 md:text-8xl">
								{signedPct}
							</p>
						</div>
					</motion.div>
				</div>
			</div>
		</Element>
	);
};
