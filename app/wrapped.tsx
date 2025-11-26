"use client";

import { AnimatePresence } from "motion/react";
import { useCallback, useState } from "react";
import { Welcome } from "@/components/Welcome";

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

export const Wrapped = ({ data }: { data: unknown }) => {
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
				return <p key="amount_of_coffee">AMOUNT_OF_COFFEE</p>;
			case States.MOST_PURCHASES:
				return <p>MOST_PURCHASES</p>;
			case States.BEST_PLACEMENT:
				return <p>BEST_PLACEMENT</p>;
			case States.LONGEST_STREAK:
				return <p>LONGEST_STREAK</p>;
			case States.FAVORITE_CAFE:
				return <p>FAVORITE_CAFE</p>;
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
		<div className="relative">
			<AnimatePresence>{renderComponent()}</AnimatePresence>
			<div className="absolute bottom-0">
				<button onClick={prevState}>Prev</button>
				<button onClick={nextState}>Next</button>
			</div>
		</div>
	);
};
