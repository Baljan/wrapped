import { useWrappedContext } from "@/app/context";
import clsx from "clsx";
import { motion } from "motion/react";
import { Element } from "react-scroll";
import { Standout } from "./Standout";

const BUY_URL = "https://www.baljan.org/credits";
const MAX_CARDS = 10;

type CardColor = "yellow" | "blue" | "white";

const colorFor = (product: string): CardColor => {
	const p = product.toLowerCase();
	if (p.includes("gul")) return "yellow";
	if (p.includes("blå")) return "blue";
	return "white";
};

const CoffeeCard = ({ color }: { color: CardColor }) => (
	<div
		className={clsx(
			"relative flex aspect-[1.586] w-72 flex-col justify-between rounded-2xl p-5 shadow-xl ring-1 ring-black/10",
			color === "yellow" && "bg-yellow-300 text-yellow-950",
			color === "blue" && "bg-blue-500 text-white",
			color === "white" && "bg-white text-emerald-900"
		)}
	>
		<span className="font-sans text-lg font-bold">Baljan</span>
		<span className="font-title text-4xl">Kaffekort</span>
		<span className="absolute top-5 right-5 h-8 w-11 rounded-md bg-current opacity-20" />
	</div>
);

export const OnlineCards = () => {
	const { online_cards } = useWrappedContext();

	if (!online_cards) {
		return null;
	}

	const { count, by_product } = online_cards;
	const cards: CardColor[] =
		count > 0
			? Object.entries(by_product)
					.flatMap(([name, n]) => Array(n).fill(colorFor(name)))
					.slice(0, MAX_CARDS)
			: ["yellow"];

	return (
		<Element
			name="online_cards"
			className="sticky top-0 flex h-screen w-screen items-center justify-center gap-24 bg-emerald-800 px-12"
		>
			{/* Cards drop in and land in a messy pile */}
			<div className="relative h-80 w-96 shrink-0">
				{cards.map((color, i) => (
					<motion.div
						key={i}
						className="absolute top-1/2 left-1/2"
						initial={{ opacity: 0, y: -500, x: "-50%", rotate: 0 }}
						whileInView={{
							opacity: 1,
							y: `calc(-50% - ${i * 10}px)`,
							x: `calc(-50% + ${((i * 53) % 60) - 30}px)`,
							rotate: ((i * 37) % 24) - 12
						}}
						transition={{
							delay: 0.4 + i * (1.4 / cards.length),
							type: "spring",
							bounce: 0.3,
							duration: 0.6
						}}
					>
						<CoffeeCard color={color} />
					</motion.div>
				))}
				{count > MAX_CARDS && (
					<motion.span
						className="absolute -top-6 -right-6 z-10 rounded-full bg-white px-4 py-2 font-sans text-2xl font-bold text-emerald-900"
						initial={{ scale: 0 }}
						whileInView={{ scale: 1 }}
						transition={{ delay: 2, type: "spring" }}
					>
						+{count - MAX_CARDS}
					</motion.span>
				)}
			</div>

			<div className="flex max-w-xl flex-col items-start text-white">
				{count > 0 ? (
					<>
						<motion.h1
							className="font-title text-6xl xl:text-7xl"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ delay: 1 }}
						>
							Du köpte {count === 1 ? "ett" : count} kaffekort
							online!
						</motion.h1>
						<motion.p
							className="mt-6 font-sans text-3xl/relaxed text-emerald-50"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ delay: 2.2 }}
						>
							Du var tidigt ute, att köpa kaffekort på nätet är
							helt nytt. Nästa kort finns där när du behöver det.
						</motion.p>
					</>
				) : (
					<>
						<motion.span
							className="rounded-full bg-amber-300 px-4 py-1 font-sans text-xl font-bold text-emerald-950"
							initial={{ opacity: 0, scale: 0.6 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.8, type: "spring" }}
						>
							Nyhet
						</motion.span>
						<motion.h1
							className="font-title mt-4 text-6xl xl:text-7xl"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ delay: 1 }}
						>
							Nu kan du köpa kaffekort online
						</motion.h1>
						<motion.p
							className="mt-6 font-sans text-3xl/relaxed text-emerald-50"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ delay: 2 }}
						>
							Köp ditt nästa kort på{" "}
							<Standout>baljan.org</Standout> så hamnar det direkt
							på ditt konto.
						</motion.p>
					</>
				)}
				<motion.a
					href={BUY_URL}
					target="_blank"
					rel="noopener"
					// The page advances on any click, don't let this one count
					onClick={(e) => e.stopPropagation()}
					className="mt-10 rounded-full bg-white px-8 py-4 font-sans text-2xl font-bold text-emerald-900 shadow-md transition-shadow hover:shadow-xl focus-visible:ring-4 focus-visible:ring-amber-300 focus-visible:outline-none"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ delay: count > 0 ? 2.8 : 2.6 }}
				>
					Köp kaffekort
				</motion.a>
			</div>
		</Element>
	);
};
