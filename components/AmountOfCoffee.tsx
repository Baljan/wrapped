"use client";

import { useWrappedContext } from "@/app/context";
import { useAnimate } from "motion/react";
import { useEffect } from "react";

export const AmountOfCoffee = () => {
	const { n_orders, caffeine_mg } = useWrappedContext();

	const [scope, animate] = useAnimate();

	useEffect(() => {
		const playAnimations = async () => {
			await animate("h1", { opacity: 1 }, { duration: 5 });
			await animate("p#hej", { opacity: 1 }, { duration: 2 });
			await animate("p#test", { opacity: 1 }, { duration: 10 });
		};

		playAnimations();
	}, [scope, animate]);

	return (
		<div ref={scope}>
			<h1 style={{ opacity: 0 }}>Wower</h1>
			<p id="hej" style={{ opacity: 0 }}>
				Hej
			</p>
			<p id="test" style={{ opacity: 0 }}>
				test
			</p>
		</div>
	);

	// return (
	// 	<motion.div
	// 		className="absolute top-0 right-0 bottom-0 left-0 z-0 flex h-screen w-screen items-center justify-center bg-green-400"
	// 		initial={{ opacity: 0 }}
	// 		animate={{ opacity: 1,}}
	// 		exit={{ opacity: 0 }}
	// 		transition={{ duration: 5 }}
	// 	>
	// 		<div className="w-fit">
	// 			<motion.h1
	// 				className="stroke-2 font-sans text-9xl"
	// 				variants={child}
	// 			>
	// 				Du drack {n_orders} koppar kaffe.
	// 			</motion.h1>
	// 			<motion.p variants={child}>
	// 				det motsvarar {caffeine_mg} mg koffein
	// 			</motion.p>
	// 		</div>
	// 	</motion.div>
	// );
};
