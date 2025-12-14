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
import { Placement } from "@/components/Placement";
import { End } from "@/components/End";

const states = [
	"welcome",
	"amount_of_coffee",
	"placement",
	"most_purchases",
	"favorite_cafe",
	"end"
];

export const Wrapped = ({ data }: { data: WrappedData }) => {
	const [state, setState] = useState<number>(2);
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
					<Placement />
					<MostPurchases />
					<FavCafe />
					<End />
				</AnimatePresence>
			</div>
		</WrappedProvider>
	);
};
