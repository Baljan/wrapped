"use client";

import { motion, AnimatePresence } from "motion/react";

export default function Home() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-48 px-16 bg-white dark:bg-black sm:items-start">
				<div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
					<AnimatePresence>
						<motion.h1
							className="w-min text-9xl font-semibold tracking-tight text-black dark:text-zinc-50"
							animate={{ rotate: 360 }}
							transition={{
								repeat: Infinity,
								repeatType: "loop",
								duration: 45,
								ease: "linear"
							}}
						>
							Blippen Wrapped
						</motion.h1>
					</AnimatePresence>
				</div>
			</main>
		</div>
	);
}
