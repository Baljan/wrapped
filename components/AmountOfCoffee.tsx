"use client";

import { useWrappedContext } from "@/app/context";
import CoffeePour from "@/public/coffee-pour.svg";
import { motion } from "motion/react";
import { Element } from "react-scroll";

const convertVolume = (v_ml: number) => {
	if (v_ml > 10e3) {
		return `${(v_ml / 10e3).toFixed(1)} liter`;
	} else if (v_ml > 10e2) {
		return `${(v_ml / 10e2).toFixed(1)} dl`;
	} else if (v_ml > 10e1) {
		return `${(v_ml / 10e1).toFixed(1)} cl`;
	}

	return `${v_ml} ml`;
};

const convertMass = (m_mg: number) => {
	if (m_mg > 10e4) {
		return `${(m_mg / 10e4).toFixed(1)} kg`;
	} else if (m_mg > 10e1) {
		return `${(m_mg / 10e1).toFixed(1)} g`;
	}

	return `${m_mg} mg`;
};

export const AmountOfCoffee = () => {
	const { n_orders, caffeine_mg } = useWrappedContext();

	return (
		<>
			<CoffeePour className="mx-auto h-fit w-96 max-w-full fill-yellow-950" />
			<Element
				name="amount_of_coffee"
				className="sticky top-0 flex h-screen w-screen flex-col items-center justify-center bg-yellow-950 px-8"
			>
				<motion.h1
					className="text-center font-sans text-5xl text-yellow-100 lg:text-9xl"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ delay: 1 }}
				>
					Du drack {n_orders} koppar kaffe!
				</motion.h1>
				<motion.p
					className="mt-4 text-center text-2xl text-yellow-100 lg:mt-12 lg:text-3xl"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ delay: 2.5 }}
				>
					Det motsvarar {convertVolume(n_orders * 220)} och{" "}
					{convertMass(caffeine_mg)} koffein.
				</motion.p>
			</Element>
		</>
	);
};
