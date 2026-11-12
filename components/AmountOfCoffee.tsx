"use client";

import { useWrappedContext } from "@/app/context";
import CoffeePour2 from "@/public/coffee-pour-2.svg";
import { motion } from "motion/react";
import { Element } from "react-scroll";
import { Standout } from "./Standout";

const convertVolume = (v_ml: number) => {
	if (v_ml > 10e2) {
		return `${(v_ml / 10e2).toFixed(1)} liter`;
	} else if (v_ml > 10e1) {
		return `${(v_ml / 10e1).toFixed(1)} dl`;
	} else if (v_ml > 10) {
		return `${(v_ml / 10).toFixed(1)} cl`;
	}

	return `${v_ml} ml`;
};

const convertMass = (m_mg: number) => {
	if (m_mg > 1e6) {
		return `${(m_mg / 1e6).toFixed(1)} kg`;
	} else if (m_mg > 1e3) {
		return `${(m_mg / 1e3).toFixed(1)} g`;
	}

	return `${m_mg} mg`;
};

export const AmountOfCoffee = () => {
	const { n_orders, caffeine_mg, week_avg } = useWrappedContext();

	return (
		<>
			<CoffeePour2
				name="coffee_pour"
				key="coffee_pour"
				className="mx-auto h-fit w-64 max-w-full fill-yellow-950 ps-20 md:w-96 md:ps-32"
			/>
			<Element
				name="amount_of_coffee"
				key="amount_of_coffee"
				className="sticky top-0 flex h-dvh w-screen flex-col items-center justify-center bg-yellow-950 px-6 md:px-8"
			>
				<motion.h1
					className="font-title pt-8 text-center text-5xl text-yellow-100 md:text-9xl"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
				>
					Du drack {n_orders} koppar kaffe!
				</motion.h1>
				<motion.p
					className="mt-6 text-center font-sans text-xl/relaxed text-yellow-100 md:mt-12 md:text-3xl/relaxed"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ delay: 2 }}
				>
					Det motsvarar{" "}
					<Standout>{convertVolume(n_orders * 220)}</Standout> och{" "}
					<Standout>
						{convertMass(n_orders * ((70 / 15) * 22))}
					</Standout>{" "}
					koffein.
				</motion.p>
				<motion.p
					className="mt-4 text-center font-sans text-xl/relaxed text-yellow-100 md:text-3xl/relaxed"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ delay: 3 }}
				>
					Det är i snitt <Standout>{week_avg} koppar</Standout> i
					veckan.
				</motion.p>
			</Element>
		</>
	);
};
