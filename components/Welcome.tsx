import { useMobileDetection } from "@/app/hooks";
import { motion } from "framer-motion";
import { Element } from "react-scroll";
import { Standout } from "./Standout";

export const Welcome = () => {
	const isMobile = useMobileDetection();

	return (
		<Element name="welcome" key="welcome">
			<motion.div
				className="relative flex h-screen w-screen flex-col items-center justify-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			>
				<div className="w-fit">
					<h1 className="font-title px-4 pt-36 text-center text-7xl text-white text-shadow-lg md:text-9xl xl:pt-32 xl:text-[12rem]">
						Blippen Wrapped
					</h1>
				</div>
				{!isMobile ? (
					<>
						<motion.h2
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
							className="mt-4 px-4 pt-4 text-center text-2xl font-bold text-white text-shadow-lg xl:pt-8 xl:text-3xl"
						>
							Dina blipps för HT25 sammanfattade
						</motion.h2>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1.5 }}
							className="mt-32 font-sans text-2xl text-white"
						>
							Du tar dig vidare genom att klicka på{" "}
							<Standout>skärmen</Standout> eller{" "}
							<Standout>mellanslag</Standout>.
						</motion.p>
					</>
				) : (
					<p className="mt-4 text-center font-sans text-2xl text-white">
						Den här sidan funkar inte på telefoner, snälla gå in på
						en dator istället!
					</p>
				)}
			</motion.div>
		</Element>
	);
};
