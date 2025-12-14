import { useWrappedContext } from "@/app/context";
import { Element } from "react-scroll";
import { FaCheck } from "react-icons/fa";
import { motion } from "motion/react";

const convertDate = (date_string: string) => {
	const date = new Date(date_string);
	const formatter = new Intl.DateTimeFormat("sv-SE", { dateStyle: "long" });

	const a = formatter.formatToParts(date);

	return `${a[0].value} ${a[2].value}`;
};

const formatMultipleDates = (d: string[]) => {
	const dates = d.map(convertDate).map((a) => "den " + a);

	if (dates.length > 3) {
		return dates.slice(0, 3).join(", ") + " bl.a.";
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
			<div className="h-36 w-screen bg-linear-to-b from-yellow-950 via-lime-800 to-green-600"></div>
			<Element
				name="most_purchases"
				className="sticky top-0 h-screen w-screen bg-green-600"
			>
				<motion.div
					className="flex h-screen w-screen flex-col items-center justify-center"
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
							className="absolute bottom-0 left-40 origin-bottom-left rotate-4"
						>
							<FaCheck className="h-48 w-48 fill-gray-300" />
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
							className="absolute right-40 bottom-0 origin-bottom-right -rotate-4"
						>
							<FaCheck className="h-48 w-48 fill-gray-300" />
						</motion.div>
						<FaCheck className="relative h-72 w-72" />
					</div>
					<motion.h1
						className="mt-8 text-center font-sans text-7xl"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ delay: 1.5 }}
					>
						Den {convertDate(most_purchases.dates[0])} blippade du
						flest gånger!
					</motion.h1>
					<motion.p
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ delay: 3 }}
						className="mt-4 text-center text-3xl lg:mt-12"
					>
						Då blippade du hela {most_purchases.count} gånger!{" "}
						<br hidden={most_purchases.dates.length == 1} />
						{most_purchases.dates.length > 1 &&
							`Du nådde samma höjder ${formatMultipleDates(most_purchases.dates.slice(1))}.`}
					</motion.p>
				</motion.div>
			</Element>
		</>
	);
};
