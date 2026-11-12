import { useWrappedContext } from "@/app/context";
import { BODY, H1, afterAnimation } from "@/app/styles";
import clsx from "clsx";
import { motion } from "motion/react";
import Image from "next/image";
import { Element } from "react-scroll";
import { Standout } from "./Standout";

const DROP_DELAY = 0.4;
const DROP_SPACING = 0.35;

// Hand-placed spots in the pile, so every card stays visible
const PILE = [
	{ x: -70, y: 30, r: -11 },
	{ x: 0, y: 0, r: 3 },
	{ x: 70, y: -30, r: 12 },
	{ x: -40, y: -50, r: -5 },
	{ x: 50, y: 45, r: 8 },
	{ x: -85, y: -15, r: 15 },
	{ x: 15, y: -70, r: -9 },
	{ x: 80, y: 15, r: -14 }
];

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
			"flex aspect-[1.586] w-72 flex-col justify-between rounded-2xl p-5 shadow-[0_14px_30px_rgba(66,32,6,0.3)]",
			color === "yellow" && "bg-yellow-300 text-yellow-950",
			color === "blue" && "bg-baljan-blue text-white",
			color === "white" && "bg-white text-yellow-950"
		)}
	>
		<Image
			src="/baljan_logga.png"
			alt=""
			width={881}
			height={881}
			className="h-12 w-12"
		/>
		<span className="font-title text-4xl">Kaffekort</span>
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
					.slice(0, PILE.length)
			: ["yellow"];
	const done = DROP_DELAY + cards.length * DROP_SPACING + 0.4;

	return (
		<Element
			name="online_cards"
			className="bg-latte sticky top-0 flex h-svh w-screen flex-col items-center justify-center gap-6 px-6 text-yellow-950 md:flex-row md:gap-24 md:px-12"
		>
			{/* Cards drop in, one per card bought, and land in a pile. On phones the
			    pile keeps its desktop layout, just scaled down to fit. */}
			<div className="relative h-60 w-72 shrink-0 md:h-96 md:w-[28rem]">
				<div className="absolute top-1/2 left-1/2 h-96 w-[28rem] -translate-1/2 scale-[0.62] md:scale-100">
					{cards.map((color, i) => (
						<motion.div
							key={i}
							className="absolute top-1/2 left-1/2"
							initial={{
								opacity: 0,
								x: "-50%",
								y: -600,
								rotate: 0
							}}
							whileInView={{
								opacity: 1,
								x: `calc(-50% + ${PILE[i].x}px)`,
								y: `calc(-50% + ${PILE[i].y}px)`,
								rotate: PILE[i].r
							}}
							viewport={{ once: true }}
							transition={{
								delay: DROP_DELAY + i * DROP_SPACING,
								type: "spring",
								bounce: 0.25,
								duration: 0.6
							}}
						>
							<CoffeeCard color={color} />
						</motion.div>
					))}
					{count > PILE.length && (
						<span className="font-title absolute -top-4 -right-4 z-10 text-5xl">
							+{count - PILE.length}
						</span>
					)}
				</div>
			</div>

			<div className="flex flex-col items-center text-center md:items-start md:text-left">
				{count > 0 ? (
					<>
						<h1 className={H1}>
							Du köpte {count === 1 ? "ett" : count} kaffekort på
							nätet
						</h1>
						<motion.p
							className={`${BODY} mt-3 md:mt-6`}
							{...afterAnimation(done)}
						>
							Smidigt, va? Nästa finns på samma ställe:{" "}
							<Standout>baljan.org</Standout>. KÖÖÖÖP!!!
						</motion.p>
					</>
				) : (
					<>
						<h1 className={H1}>Kaffekort finns på nätet nu</h1>
						<motion.p
							className={`${BODY} mt-3 md:mt-6`}
							{...afterAnimation(done)}
						>
							Köp på <Standout>baljan.org</Standout>, spara i
							snitt en timme av ditt liv per år
						</motion.p>
					</>
				)}
			</div>
		</Element>
	);
};
