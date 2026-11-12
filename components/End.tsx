import { useWrappedContext } from "@/app/context";
import { motion } from "motion/react";
import { FaRedo } from "react-icons/fa";
import { Element } from "react-scroll";
import { Standout } from "./Standout";

export const End = () => {
	const { setStep, isLast } = useWrappedContext();

	return (
		<Element
			name="end"
			className="sticky top-0 flex h-svh w-screen flex-col items-center justify-center bg-gray-50 px-6"
		>
			<motion.h1 className="font-title text-center text-6xl text-gray-900 text-shadow-xs md:mt-32 md:text-9xl">
				Stort tack för att du{" "}
				<span className="text-baljan-pink">Blippar</span>!
			</motion.h1>

			<motion.p className="mt-8 text-center font-sans text-xl text-gray-700 md:mt-16 md:text-3xl">
				pok från <Standout>nördarna</Standout> och{" "}
				<Standout>resten av baljan</Standout> ❤️
			</motion.p>

			<motion.button
				onClick={(e) => {
					e.preventDefault();

					e.currentTarget.blur();
					setStep(0);
				}}
				disabled={!isLast}
				className="bg-baljan-blue relative z-40 mt-10 flex cursor-pointer items-center justify-center gap-4 rounded-4xl px-8 py-4 text-xl font-bold text-white shadow-md transition-all hover:bg-sky-600 hover:shadow-xl md:mt-16 md:text-2xl"
			>
				<FaRedo /> Börja om
			</motion.button>
			<a
				href="https://www.baljan.org/credits"
				target="_blank"
				rel="noopener"
				// Any click advances the page, don't let this one count
				onClick={(e) => e.stopPropagation()}
				className="relative z-40 mt-6 font-sans text-base text-gray-600 underline underline-offset-4 hover:text-gray-900 md:mt-8 md:text-xl"
			>
				Köp kaffekort på baljan.org
			</a>
		</Element>
	);
};
