import { useWrappedContext } from "@/app/context";
import { Element } from "react-scroll";
import { FaCheck } from "react-icons/fa";
import { motion } from "motion/react";

export const MostPurchases = () => {
	const { most_purchases } = useWrappedContext();

	return (
		<>
			<div className="h-36 w-screen bg-linear-to-b from-yellow-950 via-lime-800 to-green-600"></div>
			<Element
				name="most_purchases"
				className="sticky top-0 flex h-screen w-screen flex-col items-center justify-center bg-green-600"
			>
				<FaCheck className="h-56 w-56" />
				<motion.h1
					className="mt-8 text-center font-sans lg:text-7xl"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ delay: 1 }}
				>
					Du blippade som mest {most_purchases.count} gånger på under
					en dag!
				</motion.h1>
				<motion.p
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ delay: 2.5 }}
					className="mt-4 text-center text-2xl lg:mt-12 lg:text-3xl"
				>
					Då blippade du {most_purchases.count} gånger
				</motion.p>
			</Element>
		</>
	);
};
