"use client";

import { AmountOfCoffee } from "@/components/AmountOfCoffee";
import { Welcome } from "@/components/Welcome";
import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { scroller } from "react-scroll";
import { WrappedProvider } from "./context";
import { WrappedData } from "./types";
import { FavCafe } from "@/components/FavCafe";
import { MostPurchases } from "@/components/MostPurchases";

const states = [
	"welcome",
	"amount_of_coffee",
	"most_purchases",
	"best_placement",
	"longest_streak",
	"favorite_cafe",
	"shortest_delta",
	"weekly_average",
	"end"
];

export const Wrapped = ({ data }: { data: WrappedData }) => {
	const [state, setState] = useState<number>(0);
	const ref = useRef<HTMLDivElement>(null);

	const nextState = useCallback(() => {
		if (state + 1 < states.length) {
			setState(state + 1);
		}
	}, [state]);

	const prevState = useCallback(() => {
		if (state - 1 >= 0) {
			setState(state - 1);
		}
	}, [state]);

	useEffect(() => {
		if (ref.current) {
			scroller.scrollTo(states[state], {
				smooth: true,
				duration: 1e3
			});
		}
	}, [ref, state]);

	return (
		<WrappedProvider data={data}>
			<div
				className="relative bg-linear-to-tr from-[#00a4e0] via-purple-500 to-[#e6008b] bg-fixed"
				ref={ref}
			>
				<AnimatePresence mode="popLayout">
					<Welcome />
					<AmountOfCoffee />
					<MostPurchases />
					<FavCafe />
				</AnimatePresence>

				<div className="fixed right-0 bottom-10 left-0 z-20 flex items-center justify-center gap-2">
					<button
						onClick={prevState}
						className="m-4 bg-black px-4 py-2"
					>
						Prev
					</button>
					<h1 className="font-sans">{state}</h1>
					<button
						onClick={nextState}
						className="m-4 bg-black px-4 py-2"
					>
						Next
					</button>
				</div>
			</div>
		</WrappedProvider>
	);
};
