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
					<h1 className="font-title px-4 pt-8 text-center text-7xl text-shadow-lg md:text-9xl xl:text-[12rem]">
						Blippen Wrapped
					</h1>
				</div>
				{!isMobile ? (
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1 }}
						className="mt-16 font-sans text-3xl"
					>
						Du tar dig vidare genom att klicka på{" "}
						<Standout>mellanslag</Standout>.
					</motion.p>
				) : (
					<p className="mt-4 text-center font-sans text-2xl">
						Den här sidan funkar inte på telefoner, snälla gå in på
						en dator istället!
					</p>
				)}
			</motion.div>
		</Element>
	);
};
