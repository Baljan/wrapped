import { motion } from "framer-motion";
import { Element } from "react-scroll";

export const Welcome = () => {
	return (
		<Element name="welcome">
			<motion.div
				className="flex h-screen w-screen items-center justify-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			>
				<div className="w-fit">
					<h1 className="px-4 font-sans text-[10rem] text-shadow-lg">
						Blippen Wrapped
					</h1>
				</div>
			</motion.div>
		</Element>
	);
};
