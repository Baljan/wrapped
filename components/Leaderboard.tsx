import { useWrappedContext } from "@/app/context";
import { convertDate } from "@/app/format";
import { BODY, H1, HERO, afterAnimation } from "@/app/styles";
import { motion } from "motion/react";
import { Element } from "react-scroll";
import { formatMultipleDates } from "./MostPurchases";
import { Standout } from "./Standout";

const MAX_TILES = 10;
const STRIP_DELAY = 0.4;
const STRIP_DURATION = 1.6;

const DAY = 24 * 60 * 60 * 1000;
const weekday = new Intl.DateTimeFormat("sv-SE", {
	weekday: "short",
	timeZone: "UTC"
});
const month = new Intl.DateTimeFormat("sv-SE", {
	month: "short",
	timeZone: "UTC"
});

/**
 * The days of the streak. The list only counts weekdays, so weekends are
 * skipped. Returns null if that doesn't add up to the streak's length (a
 * holiday, say), in which case the tiles are just numbered.
 */
const streakDays = (start: string, end: string, duration: number) => {
	const from = Date.parse(start);
	const to = Date.parse(end);
	if (isNaN(from) || isNaN(to) || to < from) {
		return null;
	}

	const days: Date[] = [];
	for (let t = from; t <= to; t += DAY) {
		const d = new Date(t);
		if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) {
			days.push(d);
		}
	}
	return days.length === duration ? days : null;
};

type Tile =
	| { kind: "day"; date: Date | null; n: number }
	| { kind: "more"; n: number }
	| { kind: "weekend" };

const buildTiles = (days: Date[] | null, duration: number): Tile[] => {
	const all = Array.from({ length: duration }, (_, i) => ({
		kind: "day" as const,
		date: days?.[i] ?? null,
		n: i + 1
	}));

	// Long streaks: the first days, how many were left out, and the last day
	const shown: Tile[] =
		duration > MAX_TILES
			? [
					...all.slice(0, MAX_TILES - 2),
					{ kind: "more", n: duration - (MAX_TILES - 1) },
					all[duration - 1]
				]
			: all;

	// Mark where the streak made it across a weekend
	return shown.flatMap((tile, i) => {
		const prev = shown[i - 1];
		const crossesWeekend =
			tile.kind === "day" &&
			prev?.kind === "day" &&
			tile.date &&
			prev.date &&
			tile.date.getTime() - prev.date.getTime() > DAY;
		return crossesWeekend ? [{ kind: "weekend" as const }, tile] : [tile];
	});
};

/** A tear-off calendar page */
const Page = ({ tile }: { tile: Tile & { kind: "day" | "more" } }) => (
	<div className="flex w-14 flex-col overflow-hidden rounded-xl bg-amber-50 shadow-[0_12px_24px_-8px_rgba(69,26,3,0.45)] md:w-24 md:rounded-2xl">
		<div className="font-title bg-amber-950 py-0.5 text-center text-sm text-amber-50 md:py-1 md:text-xl">
			{tile.kind === "more"
				? "dagar"
				: tile.date
					? weekday.format(tile.date).replace(".", "")
					: "dag"}
		</div>
		<div className="flex h-14 flex-col items-center justify-center md:h-24">
			<span className="font-title text-3xl/none md:text-5xl/none">
				{tile.kind === "more"
					? `+${tile.n}`
					: tile.date
						? tile.date.getUTCDate()
						: tile.n}
			</span>
			{tile.kind === "day" && tile.date && (
				<span className="font-title mt-0.5 text-base/none text-amber-900 md:mt-1 md:text-2xl/none">
					{month.format(tile.date).replace(".", "")}
				</span>
			)}
		</div>
	</div>
);

/** One calendar page per day on the list, dropping in one after another */
const StreakStrip = ({
	duration,
	start,
	end
}: {
	duration: number;
	start: string;
	end: string;
}) => {
	const tiles = buildTiles(streakDays(start, end, duration), duration);
	const pages = tiles.filter((t) => t.kind !== "weekend").length;
	const step = STRIP_DURATION / pages;
	let page = 0;

	return (
		<div className="mt-8 flex flex-wrap items-center justify-center gap-2 md:mt-14 md:gap-3">
			{tiles.map((tile, i) => {
				if (tile.kind === "weekend") {
					return (
						<div
							key={i}
							className="mx-0.5 h-12 border-l-2 border-dashed border-amber-950/30 md:mx-1 md:h-20"
						/>
					);
				}
				const delay = STRIP_DELAY + page++ * step;
				return (
					<motion.div
						key={i}
						initial={{ opacity: 0, y: -28, rotate: -6 }}
						whileInView={{ opacity: 1, y: 0, rotate: 0 }}
						viewport={{ once: true }}
						transition={{
							delay,
							type: "spring",
							stiffness: 320,
							damping: 18
						}}
					>
						<Page tile={tile} />
					</motion.div>
				);
			})}
		</div>
	);
};

const PLACES = [
	"etta",
	"tvåa",
	"trea",
	"fyra",
	"femma",
	"sexa",
	"sjua",
	"åtta",
	"nia",
	"tia"
];

/** 3 -> "trea", 14 -> "på plats 14" */
const placeWord = (place: number) => PLACES[place - 1] ?? `på plats ${place}`;

export const Leaderboard = () => {
	const { best_placement, longest_streak } = useWrappedContext();

	const hasStreak =
		longest_streak.duration > 1 &&
		!!longest_streak.start &&
		!!longest_streak.end;
	const place = best_placement.place + 1;
	const shared =
		best_placement.shared > 0
			? ` (delad med ${best_placement.shared} ${best_placement.shared === 1 ? "annan" : "andra"})`
			: "";
	const others =
		best_placement.other_dates.length > 0
			? ` Lika högt kom du ${formatMultipleDates(best_placement.other_dates)}.`
			: "";

	if (!hasStreak) {
		// No streak worth drawing: the best day is the whole slide
		return (
			<Element
				name="leaderboard"
				className="sticky top-0 flex h-svh w-screen flex-col items-center justify-center bg-amber-400 px-6 text-amber-950 md:px-8"
			>
				<h1 className={`${H1} text-center`}>
					Din bästa dag på topplistan
				</h1>
				<p className={`${HERO} mt-6`}>
					{place === 1 ? "Etta" : `Plats ${place}`}
				</p>
				<motion.p
					className={`${BODY} mt-8 text-center`}
					{...afterAnimation(0.6)}
				>
					Den {convertDate(best_placement.date)}, med{" "}
					<Standout>{best_placement.count} blipp</Standout>
					{shared}.{others}
				</motion.p>
			</Element>
		);
	}

	return (
		<Element
			name="leaderboard"
			className="sticky top-0 flex h-svh w-screen flex-col items-center justify-center bg-amber-400 px-6 text-amber-950 md:px-8"
		>
			<div className="flex items-center gap-4 md:gap-8">
				<span className={`${HERO} xl:text-[13rem]/none`}>
					{longest_streak.duration}
				</span>
				<h1 className={H1}>
					dagar i rad
					<br />
					på topplistan
				</h1>
			</div>

			<StreakStrip
				duration={longest_streak.duration}
				start={longest_streak.start!}
				end={longest_streak.end!}
			/>

			<motion.p
				className={`${BODY} mt-8 text-center md:mt-14`}
				{...afterAnimation(STRIP_DELAY + STRIP_DURATION)}
			>
				{place === 1 ? (
					<>
						Den {convertDate(best_placement.date)} toppade du listan
						med <Standout>{best_placement.count} blipp</Standout>
						{shared}.
					</>
				) : (
					<>
						Som bäst kom du <Standout>{placeWord(place)}</Standout>,
						den {convertDate(best_placement.date)} med{" "}
						{best_placement.count} blipp{shared}.
					</>
				)}
				{others}
			</motion.p>
		</Element>
	);
};
