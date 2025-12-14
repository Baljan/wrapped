import { useWrappedContext } from "@/app/context";
import { motion } from "motion/react";
import { FaRedo } from "react-icons/fa";
import { Element } from "react-scroll";

export const End = () => {
	const {} = useWrappedContext();

	return (
		<Element
			name="end"
			className="sticky top-0 flex h-screen w-screen flex-col items-center justify-center bg-gray-50"
		>
			<motion.h1 className="font-title mt-32 text-9xl text-gray-900 text-shadow-xs">
				Stort tack för att du blippar!
			</motion.h1>

			<motion.p className="mt-16 text-center font-sans text-4xl text-gray-700">
				Hoppas vi ses igen nästa termin! <br />
				<br />
				pok nördarna och resten av baljan
			</motion.p>

			<motion.button
				onClick={() => alert("Would return to top")}
				className="mt-16 flex cursor-pointer items-center justify-center gap-2 rounded-4xl bg-blue-500 px-8 py-4 font-sans shadow-md transition-all hover:bg-blue-600 hover:shadow-xl"
			>
				<FaRedo /> Börja från början
			</motion.button>
		</Element>
	);
};
