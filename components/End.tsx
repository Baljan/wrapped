import { useWrappedContext } from "@/app/context";
import { motion } from "motion/react";
import { FaRedo } from "react-icons/fa";
import { Element } from "react-scroll";
import { Standout } from "./Standout";

export const End = () => {
	const { setStep, step } = useWrappedContext();

	return (
		<Element
			name="end"
			className="sticky top-0 flex h-screen w-screen flex-col items-center justify-center bg-gray-50"
		>
			<motion.h1 className="font-title mt-32 text-center text-9xl text-gray-900 text-shadow-xs">
				Stort tack för att du blippar!
			</motion.h1>

			<motion.p className="mt-16 text-center font-sans text-3xl text-gray-700">
				pok från <Standout>nördarna</Standout> och{" "}
				<Standout>resten av baljan</Standout> ❤️
			</motion.p>

			<motion.button
				onClick={(e) => {
					e.currentTarget.blur();
					setStep(0);
				}}
				disabled={step != 5}
				className="mt-16 flex cursor-pointer items-center justify-center gap-4 rounded-4xl bg-blue-500 px-8 py-4 text-2xl font-bold shadow-md transition-all hover:bg-blue-600 hover:shadow-xl"
			>
				<FaRedo /> Börja från början
			</motion.button>
		</Element>
	);
};
