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
import { WELCOME_BACKGROUND } from "./styles";

export type WrappedContextSchema = WrappedData;

export type SlideState = {
	name: string;
	lock_duration: number;
	/** The slide's background color, used to tint Safari's toolbars. */
	color?: string;
};

/** Turn "var(--x)" into the value behind it, meta tags can't read variables. */
const resolveColor = (color: string) => {
	const v = color.match(/^var\((--[^)]+)\)$/);
	return v
		? getComputedStyle(document.documentElement)
				.getPropertyValue(v[1])
				.trim()
		: color;
};

/** The welcome slide is a gradient, tint the bars with its top edge */
const WELCOME_TINT = "var(--color-purple-500)";

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

	// The color of the slide on screen, for the browser's own bars
	const tint = STATES[step].color ?? WELCOME_TINT;

	// Older Safari and Chrome on Android follow theme-color. Safari 26+ ignores
	// it in a normal tab and picks the color of a fixed element along the
	// screen edge instead, see the background layer below.
	useEffect(() => {
		let meta = document.querySelector<HTMLMetaElement>(
			'meta[name="theme-color"]'
		);
		if (!meta) {
			meta = document.createElement("meta");
			meta.name = "theme-color";
			document.head.appendChild(meta);
		}
		meta.content = resolveColor(tint);
	}, [tint]);

	// Slides are h-dvh, so when Safari's toolbar or the window changes size
	// every slide moves. Snap back to the current one, or the next slide
	// peeks in at the bottom.
	useEffect(() => {
		const resync = () =>
			scroller.scrollTo(STATES[step].name, {
				smooth: false,
				duration: 0
			});

		window.addEventListener("resize", resync);
		return () => window.removeEventListener("resize", resync);
	}, [step, STATES]);

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
				className="relative touch-manipulation"
				ref={ref}
				// iOS Safari only sends clicks on plain elements up to the document
				// when some ancestor listens for them, so give it one.
				onClick={() => undefined}
			>
				{/* Page background. A fixed layer instead of bg-fixed, which iOS
				    ignores and would stretch the gradient over every slide.
				    Safari 26+ tints its status bar and toolbar after the
				    background-color of a fixed element along the screen edge,
				    otherwise it took the first sticky slide's brown for good.
				    The gradient image paints over the color, so it never shows. */}
				<div
					aria-hidden
					className={`${WELCOME_BACKGROUND} fixed inset-0 -z-10`}
					style={{ backgroundColor: tint }}
				/>
				<AnimatePresence>{children}</AnimatePresence>
				{/* Bouncing arrow once the slide is done and the next one can be
				    reached. The dark disc keeps it visible on the light slides. */}
				{step < STATES.length - 1 && (
					<div
						id="next-hint"
						aria-hidden={disabled}
						className="pointer-events-none fixed inset-x-0 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-40 flex justify-center transition-opacity duration-500 aria-hidden:opacity-0 aria-hidden:duration-150 md:bottom-10"
					>
						<div className="flex h-10 w-10 animate-bounce items-center justify-center rounded-full bg-black/25 text-lg text-white backdrop-blur-sm md:h-12 md:w-12 md:text-xl">
							<FaArrowDownLong />
						</div>
					</div>
				)}
			</div>
		</WrappedContext.Provider>
	);
};

export default WrappedContext;
