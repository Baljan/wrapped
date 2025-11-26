import { motion } from "framer-motion";

export const Welcome = () => {
	return (
		<motion.div
			className="flex h-screen w-screen items-center justify-center bg-linear-to-tr from-[#00a4e0] via-purple-500 to-[#e6008b]"
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
