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

export type SlideState = { name: string; lock_duration: number };

const WrappedContext = createContext<
	WrappedContextSchema & {
		setStep: (step: number) => void;
		step: number;
		isLast: boolean;
	}
>({
	is_staff: true,
	overall_placement: 0,
	n_orders: 1337,
	caffeine_mg: 42069,
	most_purchases: {
		count: 42,
		dates: ["2048-02-31"]
	},
	best_placement: {
		date: "1970-01-01",
		count: -1,
		place: 0,
		shared: 0,
		other_dates: []
	},
	longest_streak: {
		start: "2001-06-10",
		end: "2075-02-16",
		duration: Math.PI
	},
	shortest_delta: "0",
	fav_cafe: {
		id: 0,
		n_orders: 2
	},
	week_avg: Math.LN2,
	setStep: () => void 0,
	step: 0,
	isLast: false
});

export const useWrappedContext = () => useContext(WrappedContext);

export const WrappedProvider = ({
	children,
	data,
	states: STATES
}: {
	children: ReactNode;
	data: WrappedData;
	states: SlideState[];
}) => {
	const [step, setStep] = useState<number>(0);
	const ref = useRef<HTMLDivElement>(null);
	const isMobile = useMobileDetection();

	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		const getTimeout = () => {
			setDisabled(true);

			return setTimeout(
				() => setDisabled(false),
				STATES[step].lock_duration * 1e3
			);
		};

		if (ref.current) {
			scroller.scrollTo(STATES[step].name, {
				smooth: true,
				duration: 1e3
			});

			const timeout = getTimeout();

			return () => {
				clearTimeout(timeout);
			};
		}
	}, [ref, step, STATES]);

	useEffect(() => {
		function keyboardListener(ev: KeyboardEvent) {
			ev.preventDefault();

			if (ev.code === "Space" && step + 1 < STATES.length) {
				if (disabled || isMobile) {
					return;
				}
				setStep(step + 1);
			}
		}

		function touchScreenListener(ev: PointerEvent) {
			ev.preventDefault();

			if (step + 1 < STATES.length) {
				if (disabled || isMobile) {
					return;
				}
				setStep(step + 1);
			}
		}

		document.addEventListener("click", touchScreenListener);
		document.addEventListener("keypress", keyboardListener);

		return () => {
			document.removeEventListener("click", touchScreenListener);
			document.removeEventListener("keypress", keyboardListener);
		};
	}, [step, disabled, isMobile, STATES]);

	return (
		<WrappedContext.Provider
			value={{
				...data,
				setStep,
				step,
				isLast: step === STATES.length - 1
			}}
		>
			<div
				className="from-baljan-dark-blue to-baljan-pink relative bg-linear-to-tr via-purple-500 bg-fixed"
				ref={ref}
			>
				<AnimatePresence>{children}</AnimatePresence>
				{!isMobile && step < STATES.length - 1 && (
					<div
						id="keyboard-hint"
						aria-hidden={disabled}
						className="fixed bottom-8 left-1/2 z-40 -translate-x-1/2 fill-white text-4xl font-bold text-white opacity-80 transition-opacity duration-300 aria-hidden:opacity-0 2xl:bottom-16"
					>
						<FaArrowDownLong />
					</div>
				)}
			</div>
		</WrappedContext.Provider>
	);
};

export default WrappedContext;
