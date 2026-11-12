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

/** How far up a finger has to travel for a swipe to count, in px */
const SWIPE_DISTANCE = 40;

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
	const [step, setStep] = useState<number>(() => {
		// Dev only: ?slide=<name> jumps straight to a slide, handy when
		// reviewing a single slide without clicking through all of them.
		if (
			process.env.NODE_ENV === "production" ||
			typeof window === "undefined"
		) {
			return 0;
		}
		const name = new URLSearchParams(window.location.search).get("slide");
		const i = STATES.findIndex((s) => s.name === name);
		return Math.max(i, 0);
	});
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
		const next = () => {
			if (!disabled && step + 1 < STATES.length) {
				setStep(step + 1);
			}
		};

		function keyboardListener(ev: KeyboardEvent) {
			ev.preventDefault();

			if (ev.code === "Space") {
				next();
			}
		}

		function clickListener(ev: MouseEvent) {
			ev.preventDefault();
			next();
		}

		// Phones: a tap is a click, a swipe up also moves on. The page itself
		// never scrolls by touch (body is overflow-hidden), only through
		// setStep, so the scroll lock above holds for touch as well.
		let touchStart: { x: number; y: number } | null = null;

		function touchStartListener(ev: TouchEvent) {
			touchStart =
				ev.touches.length === 1
					? { x: ev.touches[0].clientX, y: ev.touches[0].clientY }
					: null;
		}

		function touchMoveListener(ev: TouchEvent) {
			// Stop rubber-banding and any native scroll, but leave pinch zoom be
			if (ev.touches.length === 1 && ev.cancelable) {
				ev.preventDefault();
			}
		}

		function touchEndListener(ev: TouchEvent) {
			if (!touchStart || ev.changedTouches.length !== 1) {
				return;
			}
			const dx = ev.changedTouches[0].clientX - touchStart.x;
			const dy = ev.changedTouches[0].clientY - touchStart.y;
			touchStart = null;
			if (dy < -SWIPE_DISTANCE && Math.abs(dy) > Math.abs(dx)) {
				next();
			}
		}

		document.addEventListener("click", clickListener);
		document.addEventListener("keypress", keyboardListener);
		document.addEventListener("touchstart", touchStartListener, {
			passive: true
		});
		document.addEventListener("touchmove", touchMoveListener, {
			passive: false
		});
		document.addEventListener("touchend", touchEndListener, {
			passive: true
		});

		return () => {
			document.removeEventListener("click", clickListener);
			document.removeEventListener("keypress", keyboardListener);
			document.removeEventListener("touchstart", touchStartListener);
			document.removeEventListener("touchmove", touchMoveListener);
			document.removeEventListener("touchend", touchEndListener);
		};
	}, [step, disabled, STATES]);

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
				className="from-baljan-dark-blue to-baljan-pink relative touch-manipulation bg-linear-to-tr via-purple-500 bg-fixed"
				ref={ref}
				// iOS Safari only sends clicks on plain elements up to the document
				// when some ancestor listens for them, so give it one.
				onClick={() => undefined}
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
