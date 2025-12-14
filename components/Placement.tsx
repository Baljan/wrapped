import { useWrappedContext } from "@/app/context";
import { motion, useInView } from "motion/react";
import { Element } from "react-scroll";
import StolenCounter from "./StolenCounter";
import Confetti from "react-confetti-boom";
import { useEffect, useRef } from "react";

const CUTOFF = 50;

export const Placement = () => {
	const { overall_placement, is_staff } = useWrappedContext();
	const ref = useRef(null);
	const isInView = useInView(ref);

	const getCongratulationsMessage = () => {
		if (overall_placement == 0) {
			return (
				<>
					En första plats! Stort, stort grattis!
					<br />
					Det finns inget pris bättre än äran, och kanske en
					reflektion över sin konsumering.
				</>
			);
		} else if (overall_placement == 1) {
			return "En stark andraplats! Riktigt bra kämpat!";
		} else if (overall_placement == 2) {
			return "Topp tre! En av dem som krigat mest alltså!";
		} else if (overall_placement < 10) {
			return "Topp tio, riktigt bra placering!";
		} else if (overall_placement < CUTOFF) {
			return "Ändå bland de översta femtio. Bra där!";
		}

		return "Inte ens topp femtio? Kom igen nu!";
	};

	return (
		<Element
			name="placement"
			className="sticky top-0 flex h-screen w-screen flex-col items-center justify-center bg-blue-400"
		>
			<motion.h1
				className="font-title relative z-0 pt-8 text-center text-8xl"
				ref={ref}
			>
				Du hamnade på plats
				<br />
				<StolenCounter
					gradientFrom="#51a2ff"
					value={overall_placement + 1}
					fontSize={160}
				/>
				<br />
				bland alla {is_staff ? "jobbare" : "vanliga användare"}!
			</motion.h1>
			{isInView && overall_placement < CUTOFF && (
				<Confetti
					mode="boom"
					particleCount={128}
					spreadDeg={40}
					launchSpeed={
						1 +
						Math.cos(
							(Math.PI / 2) *
								(Math.min(overall_placement, CUTOFF) / CUTOFF)
						) *
							0.8
					}
					effectCount={1}
					colors={["#78ff44", "#ff718d", "#fdff6a", "#a864fd"]}
					y={0.8}
					className="relative z-10"
				/>
			)}
			<motion.p
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ delay: 2 }}
				className="mt-8 max-w-196 text-center font-sans text-3xl"
			>
				{getCongratulationsMessage()}
			</motion.p>
		</Element>
	);
};
