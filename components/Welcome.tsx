import { useWrappedContext } from "@/app/context";
import { semesterShort } from "@/app/format";
import { useMobileDetection } from "@/app/hooks";
import { motion } from "framer-motion";
import { Element } from "react-scroll";
import { Standout } from "./Standout";

export const Welcome = () => {
	const isMobile = useMobileDetection();
	const { semester } = useWrappedContext();

	return (
		// Same gradient as the page behind it. iOS ignores bg-fixed there, which
		// would stretch it over every slide, so the first screen paints its own.
		<Element
			name="welcome"
			key="welcome"
			className="from-baljan-dark-blue to-baljan-pink bg-linear-to-tr via-purple-500"
		>
			<motion.div
				className="relative flex h-svh w-screen flex-col items-center justify-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			>
				<div className="w-fit">
					<h1 className="font-title px-4 pt-36 text-center text-7xl text-white text-shadow-lg md:text-9xl xl:pt-32 xl:text-[12rem]">
						Blippen Wrapped
					</h1>
				</div>
				<motion.h2
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
					className="mt-4 px-4 pt-4 text-center text-xl font-bold text-white text-shadow-lg md:text-2xl xl:pt-8 xl:text-3xl"
				>
					Dina blipps för {semesterShort(semester)} sammanfattade
				</motion.h2>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.5 }}
					className="mt-20 px-6 text-center font-sans text-xl text-white md:mt-32 md:text-2xl"
				>
					{isMobile ? (
						<>
							<Standout>Tryck</Standout> på skärmen eller{" "}
							<Standout>svep uppåt</Standout> för att gå vidare.
						</>
					) : (
						<>
							Du tar dig vidare genom att klicka på{" "}
							<Standout>skärmen</Standout> eller{" "}
							<Standout>mellanslag</Standout>.
						</>
					)}
				</motion.p>
			</motion.div>
		</Element>
	);
};
