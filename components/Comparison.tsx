import { useWrappedContext } from "@/app/context";
import { semesterName } from "@/app/format";
import { motion } from "motion/react";
import { FaMugHot } from "react-icons/fa6";
import { Element } from "react-scroll";
import { Standout } from "./Standout";

const MAX_CUPS_PER_ROW = 20;

const CupRow = ({
	label,
	count,
	perCup,
	delay,
	dim
}: {
	label: string;
	count: number;
	perCup: number;
	delay: number;
	dim?: boolean;
}) => {
	const cups = Math.ceil(count / perCup);

	return (
		<div className="flex items-center gap-6">
			<p className="w-56 shrink-0 text-right font-sans text-2xl text-orange-50 first-letter:uppercase">
				{label}
			</p>
			<div className="flex min-h-12 w-[calc(20*2.75rem)] max-w-[60vw] flex-wrap gap-1">
				{Array.from({ length: cups }, (_, i) => (
					<motion.span
						key={i}
						initial={{ opacity: 0, y: -24, scale: 0.6 }}
						whileInView={{ opacity: 1, y: 0, scale: 1 }}
						viewport={{ once: true }}
						transition={{
							delay: delay + i * (1.2 / cups),
							type: "spring",
							bounce: 0.5,
							duration: 0.4
						}}
					>
						<FaMugHot
							className={
								dim
									? "h-10 w-10 fill-orange-300"
									: "h-10 w-10 fill-white"
							}
						/>
					</motion.span>
				))}
			</div>
			<motion.p
				className="font-title text-5xl text-white"
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ delay: delay + 1.3 }}
			>
				{count}
			</motion.p>
		</div>
	);
};

export const Comparison = () => {
	const { n_orders, previous, semester } = useWrappedContext();

	if (!previous) {
		return null;
	}

	const prev = previous.n_orders;
	const prevName = semesterName(previous.semester);
	const nowName = semesterName(semester);
	const perCup = Math.max(
		1,
		Math.ceil(Math.max(prev, n_orders) / MAX_CUPS_PER_ROW)
	);
	const pct =
		prev > 0 ? Math.round((Math.abs(n_orders - prev) / prev) * 100) : 0;

	let title: string;
	let subtitle: React.ReactNode;
	if (prev === 0) {
		title = `Ny stammis sedan ${prevName}!`;
		subtitle = (
			<>
				Då blev det inte en enda kopp.{" "}
				{nowName[0].toUpperCase() + nowName.slice(1)} blev det{" "}
				<Standout>{n_orders}</Standout>.
			</>
		);
	} else if (n_orders > prev) {
		title = `Du blippade ${pct} % mer än ${prevName}!`;
		subtitle = (
			<>
				Det är <Standout>{n_orders - prev} koppar</Standout> fler. Vi
				gissar att kursen blev tuffare.
			</>
		);
	} else if (n_orders < prev) {
		title = `En lugnare termin än ${prevName}`;
		subtitle = (
			<>
				<Standout>{prev - n_orders} koppar</Standout> färre, {pct} %
				mindre. Sov du mer i år?
			</>
		);
	} else {
		title = `Exakt lika många koppar som ${prevName}!`;
		subtitle = "Det kallar vi stabil kaffekonsumtion.";
	}

	return (
		<Element
			name="comparison"
			className="sticky top-0 flex h-screen w-screen flex-col items-center justify-center bg-orange-600 px-8"
		>
			<motion.h1
				className="font-title max-w-5xl text-center text-6xl text-white xl:text-7xl"
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ delay: 0.3 }}
			>
				{title}
			</motion.h1>

			<div className="mt-16 flex flex-col gap-6">
				<CupRow
					label={prevName}
					count={prev}
					perCup={perCup}
					delay={0.8}
					dim
				/>
				<CupRow
					label={nowName}
					count={n_orders}
					perCup={perCup}
					delay={2}
				/>
			</div>

			{perCup > 1 && (
				<p className="mt-4 font-sans text-lg text-orange-100">
					En kopp = {perCup} blipp
				</p>
			)}

			<motion.p
				className="mt-12 max-w-3xl text-center font-sans text-3xl/relaxed text-white"
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ delay: 3.6 }}
			>
				{subtitle}
			</motion.p>
		</Element>
	);
};
