import { useWrappedContext } from "@/app/context";
import { Element } from "react-scroll";
import { FaCheck } from "react-icons/fa";
import { motion } from "motion/react";
import { convertDate } from "@/app/format";
import { Standout } from "./Standout";

export const formatMultipleDates = (d: string[]) => {
	const dates = d.map(convertDate).map((a) => "den " + a);

	if (dates.length == 1) {
		return dates[0];
	}

	if (dates.length > 3) {
		return dates.slice(0, 3).join(", ") + " bl.a";
	} else {
		return (
			dates.slice(0, dates.length - 1).join(", ") +
			" och " +
			dates[dates.length - 1]
		);
	}
};

export const MostPurchases = () => {
	const { most_purchases } = useWrappedContext();

	return (
		<>
			<Element
				name="most_purchases"
				className="sticky top-0 h-svh w-screen bg-green-600"
			>
				<motion.div
					className="flex h-svh w-screen flex-col items-center justify-center px-6"
					initial={{
						scale: 0
					}}
					whileInView={{
						scale: 1
					}}
					transition={{ delay: 0.5 }}
				>
					<div className="relative">
						<motion.div
							initial={{
								scale: 0
							}}
							whileInView={{
								scale: 1
							}}
							transition={{
								delay: 0.6,
								type: "spring",
								duration: 0.4
							}}
							className="absolute bottom-0 left-12 origin-bottom-left rotate-4 md:left-20 xl:left-40"
						>
							<FaCheck className="h-20 w-20 fill-gray-300 md:h-32 md:w-32 xl:h-48 xl:w-48" />
						</motion.div>
						<motion.div
							initial={{
								scale: 0
							}}
							whileInView={{
								scale: 1
							}}
							transition={{
								delay: 0.7,
								type: "spring",
								duration: 0.4
							}}
							className="absolute right-12 bottom-0 origin-bottom-right -rotate-4 md:right-20 xl:right-40"
						>
							<FaCheck className="h-20 w-20 fill-gray-300 md:h-32 md:w-32 xl:h-48 xl:w-48" />
						</motion.div>
						<FaCheck className="relative h-32 w-32 text-white md:h-48 md:w-48 xl:h-72 xl:w-72" />
					</div>
					<motion.h1
						className="font-title mt-6 text-center text-4xl text-balance text-white md:mt-8 md:text-6xl xl:text-7xl"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ delay: 1 }}
					>
						Den {convertDate(most_purchases.dates[0])} blippade du
						flest gånger!
					</motion.h1>
					<motion.p
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ delay: 2 }}
						className="line mt-4 text-center font-sans text-xl/relaxed text-white md:mt-12 md:text-3xl/relaxed"
					>
						Då blippade du{" "}
						<span hidden={most_purchases.count <= 1}>hela</span>{" "}
						<Standout>
							{most_purchases.count} gång
							<span hidden={most_purchases.count <= 1}>
								er
							</span>{" "}
						</Standout>
						under en dag.
						<br hidden={most_purchases.dates.length == 1} />
						{most_purchases.dates.length > 1 &&
							`Du nådde samma höjder ${formatMultipleDates(most_purchases.dates.slice(1))}.`}
					</motion.p>
				</motion.div>
			</Element>
		</>
	);
};
