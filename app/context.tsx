"use client";

import { AnimatePresence } from "motion/react";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useRef,
	useState
} from "react";
import { FaArrowDownLong } from "react-icons/fa6";
import { scroller } from "react-scroll";
import { WrappedData } from "./types";
import { useMobileDetection } from "./hooks";

export type WrappedContextSchema = WrappedData;

const TIMERS = [0, 5, 5, 5, 7, 0];

const WrappedContext = createContext<
	WrappedContextSchema & {
		setStep: (step: number) => void;
		step: number;
	}
>({
	is_staff: true,
	overall_placement: 8,
	n_orders: 162,
	caffeine_mg: 39204,
	most_purchases: {
		count: 5,
		dates: ["2025-09-23", "2025-08-29", "2025-09-30"]
	},
	best_placement: {
		date: "2025-09-30",
		count: 5,
		place: 0,
		shared: 0,
		other_dates: ["2025-08-18", "2025-09-17"]
	},
	longest_streak: {
		start: "2025-08-26",
		end: "2025-09-01",
		duration: 5
	},
	shortest_delta: "0:00:05.863673",
	fav_cafe: {
		id: 0,
		n_orders: 146
	},
	week_avg: 1.82,
	setStep: (_v) => void 0,
	step: 0
});

export const useWrappedContext = () => useContext(WrappedContext);

const states = [
	"welcome",
	"amount_of_coffee",
	"placement",
	"most_purchases",
	"favorite_cafe",
	"end"
];

export const WrappedProvider = ({
	children,
	data
}: {
	children: ReactNode;
	data: WrappedData;
}) => {
	const [step, setStep] = useState<number>(0);
	const ref = useRef<HTMLDivElement>(null);
	const isMobile = useMobileDetection();

	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		const getTimeout = () => {
			setDisabled(true);

			return setTimeout(() => setDisabled(false), TIMERS[step] * 1e3);
		};

		if (ref.current) {
			scroller.scrollTo(states[step], {
				smooth: true,
				duration: 1e3
			});

			const timeout = getTimeout();

			return () => {
				clearTimeout(timeout);
			};
		}
	}, [ref, step]);

	useEffect(() => {
		function eventListener(ev: KeyboardEvent) {
			ev.preventDefault();

			if (ev.code === "Space" && step + 1 < states.length) {
				if (disabled || isMobile) {
					return;
				}
				setStep(step + 1);
			}
		}

		document.addEventListener("keypress", eventListener);

		return () => {
			document.removeEventListener("keypress", eventListener);
		};
	}, [step, disabled, isMobile]);

	return (
		<WrappedContext.Provider value={{ ...data, setStep, step }}>
			<div
				className="relative bg-linear-to-tr from-[#00a4e0] via-purple-500 to-[#e6008b] bg-fixed"
				ref={ref}
			>
				<AnimatePresence>{children}</AnimatePresence>
				{!isMobile && step < states.length - 1 && (
					<div
						id="keyboard-hint"
						aria-hidden={disabled}
						className="fixed bottom-8 left-1/2 z-40 -translate-x-1/2 fill-white text-4xl font-bold text-white opacity-80 transition-opacity duration-300 aria-hidden:opacity-0 2xl:bottom-16"
					>
						<FaArrowDownLong />
					</div>
				)}
				<div className="fixed top-0 right-0 bottom-0 left-0 z-40 bg-transparent" />
			</div>
		</WrappedContext.Provider>
	);
};

export default WrappedContext;
