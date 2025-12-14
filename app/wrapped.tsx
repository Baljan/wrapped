"use client";

import { AmountOfCoffee } from "@/components/AmountOfCoffee";
import { FavCafe } from "@/components/FavCafe";
import { MostPurchases } from "@/components/MostPurchases";
import { Welcome } from "@/components/Welcome";
import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { scroller } from "react-scroll";
import { WrappedProvider } from "./context";
import { WrappedData } from "./types";

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

	useEffect(() => {
		if (ref.current) {
			scroller.scrollTo(states[state], {
				smooth: true,
				duration: 1e3
			});
		}
	}, [ref, state]);

	useEffect(() => {
		document.addEventListener("keypress", (ev) => {
			if (ev.code === "Space" && state + 1 < states.length) {
				setState(state + 1);
			} else if (ev.code === "Enter" && state - 1 >= 0) {
				setState(state - 1);
			}
		});
	}, [state]);

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
			</div>
		</WrappedProvider>
	);
};
