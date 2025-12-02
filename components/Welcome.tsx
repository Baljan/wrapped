import { useWrappedContext } from "@/app/context";
import { motion } from "framer-motion";

export const Welcome = () => {
	return (
		<motion.div
			className="absolute top-0 right-0 bottom-0 left-0 z-0 flex h-screen w-screen items-center justify-center bg-linear-to-tr from-[#00a4e0] via-purple-500 to-[#e6008b]"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<div className="w-fit">
				<h1 className="stroke-2 font-sans text-9xl">Blippen Wrapped</h1>
			</div>
		</motion.div>
	);
};
