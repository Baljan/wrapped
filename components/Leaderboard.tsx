import { useWrappedContext } from "@/app/context";
import { convertDate } from "@/app/format";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Confetti from "react-confetti-boom";
import { Element } from "react-scroll";
import { formatMultipleDates } from "./MostPurchases";
import { Standout } from "./Standout";

const MAX_TILES = 20;

const StreakStrip = ({
	duration,
	start,
	end
}: {
	duration: number;
	start: string;
	end: string;
}) => {
	const tiles = Math.min(duration, MAX_TILES);
	const step = 1.6 / tiles;

	return (
		<div className="mt-12 flex flex-col items-stretch">
			<div className="flex gap-2">
				{Array.from({ length: tiles }, (_, i) => (
					<motion.div
						key={i}
						className="flex h-16 w-12 items-center justify-center rounded-xl border-4 border-amber-950/30 font-sans text-xl font-bold"
						initial={{
							backgroundColor: "rgba(0,0,0,0)",
							color: "rgba(69,26,3,0.4)"
						}}
						whileInView={{
							backgroundColor: "rgb(69,26,3)",
							color: "rgb(254,243,199)",
							borderColor: "rgb(69,26,3)"
						}}
						transition={{ delay: 0.8 + i * step, duration: 0.2 }}
					>
						{i === tiles - 1 && duration > MAX_TILES
							? `+${duration - MAX_TILES + 1}`
							: i + 1}
					</motion.div>
				))}
			</div>
			<div className="mt-2 flex justify-between font-sans text-lg text-amber-900">
				<span>{convertDate(start)}</span>
				{duration > 1 && <span>{convertDate(end)}</span>}
			</div>
		</div>
	);
};

export const Leaderboard = () => {
	const { best_placement, longest_streak } = useWrappedContext();
	const ref = useRef(null);
	const isInView = useInView(ref);

	const hasStreak =
		longest_streak.duration > 0 &&
		!!longest_streak.start &&
		!!longest_streak.end;
	const first = best_placement.place === 0;

	return (
		<Element
			name="leaderboard"
			className="sticky top-0 flex h-screen w-screen flex-col items-center justify-center bg-amber-400 px-8 text-amber-950"
		>
			<h1
				className="font-title text-center text-6xl xl:text-7xl"
				ref={ref}
			>
				{hasStreak
					? longest_streak.duration === 1
						? "En dag på dagens topplista!"
						: `${longest_streak.duration} dagar i rad på dagens topplista!`
					: "Din bästa dag på topplistan"}
			</h1>

			{hasStreak && (
				<StreakStrip
					duration={longest_streak.duration}
					start={longest_streak.start!}
					end={longest_streak.end!}
				/>
			)}

			{isInView && first && (
				<Confetti
					mode="boom"
					particleCount={96}
					effectCount={1}
					colors={["#451a03", "#ffffff", "#e6008b", "#00a4e0"]}
					y={0.6}
				/>
			)}

			<motion.p
				className="mt-12 max-w-3xl text-center font-sans text-3xl/relaxed"
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ delay: hasStreak ? 2.8 : 0.8 }}
			>
				{first ? (
					<>
						Den {convertDate(best_placement.date)} toppade du listan
						med <Standout>{best_placement.count} blipp</Standout>!
					</>
				) : (
					<>
						Din bästa dag var den {convertDate(best_placement.date)}
						, då du kom på{" "}
						<Standout>plats {best_placement.place + 1}</Standout>{" "}
						{best_placement.shared > 0 &&
							`(delad med ${best_placement.shared} ${best_placement.shared === 1 ? "annan" : "andra"}) `}
						med {best_placement.count} blipp.
					</>
				)}
				{best_placement.other_dates.length > 0 && (
					<>
						<br />
						Lika högt kom du{" "}
						{formatMultipleDates(best_placement.other_dates)}.
					</>
				)}
			</motion.p>
		</Element>
	);
};
