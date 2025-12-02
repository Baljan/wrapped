"use client";

import { AmountOfCoffee } from "@/components/AmountOfCoffee";
import { FavCafe } from "@/components/FavCafe";
import { Welcome } from "@/components/Welcome";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import WrappedContext from "./context";
import { WrappedData } from "./types";

enum States {
	WELCOME = 0,
	AMOUNT_OF_COFFEE = 1,
	MOST_PURCHASES = 2,
	BEST_PLACEMENT = 3,
	LONGEST_STREAK = 4,
	FAVORITE_CAFE = 5,
	SHORTEST_DELTA = 6,
	WEEKLY_AVERAGE = 7,
	END = 8
}

export const Wrapped = ({ data }: { data: WrappedData }) => {
	const [state, setState] = useState<States>(States.WELCOME);

	const nextState = useCallback(() => {
		if (state + 1 in States) {
			setState(state + 1);
		}
	}, [state]);

	const prevState = useCallback(() => {
		if (state - 1 in States) {
			setState(state - 1);
		}
	}, [state]);

	const renderComponent = () => {
		switch (state) {
			case States.WELCOME:
				return <Welcome key={"welcome"} />;
			case States.AMOUNT_OF_COFFEE:
				return <AmountOfCoffee key="amount" />;
			case States.MOST_PURCHASES:
				return <p>MOST_PURCHASES</p>;
			case States.BEST_PLACEMENT:
				return <p>BEST_PLACEMENT</p>;
			case States.LONGEST_STREAK:
				return (
					<motion.p
						exit={{ opacity: 1 }}
						transition={{ duration: 5 }}
						className="h-full w-full bg-white"
						key="wower"
					>
						LONGEST_STREAK
					</motion.p>
				);
			case States.FAVORITE_CAFE:
				return <FavCafe key="fav" />;
			case States.SHORTEST_DELTA:
				return <p>SHORTEST_DELTA</p>;
			case States.WEEKLY_AVERAGE:
				return <p>WEEKLY_AVERAGE</p>;
			case States.END:
				return <p>END</p>;
			default:
				return null;
		}
	};

	return (
		<WrappedContext.Provider value={data}>
			<div className="relative h-screen w-screen">
				<AnimatePresence>{renderComponent()}</AnimatePresence>

				<div className="absolute right-0 bottom-0 left-0 z-10 flex items-center justify-center gap-2">
					<button
						onClick={prevState}
						className="m-4 bg-black px-4 py-2"
					>
						Prev
					</button>
					<button
						onClick={nextState}
						className="m-4 bg-black px-4 py-2"
					>
						Next
					</button>
				</div>
			</div>
		</WrappedContext.Provider>
	);
};
