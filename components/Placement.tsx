import { useWrappedContext } from "@/app/context";
import { useMobileDetection } from "@/app/hooks";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Confetti from "react-confetti-boom";
import { Element } from "react-scroll";
import Counter from "./Counter";
import { Standout } from "./Standout";

const CUTOFF = 50;

export const Placement = () => {
	const { overall_placement, is_staff } = useWrappedContext();
	const ref = useRef(null);
	const isInView = useInView(ref);
	const isMobile = useMobileDetection();

	const getCongratulationsMessage = () => {
		if (overall_placement == 0) {
			return (
				<>
					En <Standout>första plats</Standout>! Stort, stort grattis!
					<br />
					Det finns inget pris bättre än äran, visst?
				</>
			);
		} else if (overall_placement == 1) {
			return (
				<>
					En stark <Standout>andraplats</Standout>! Riktigt bra
					kämpat!
				</>
			);
		} else if (overall_placement == 2) {
			return "Topp tre! En av dem som krigat absolut mest!";
		} else if (overall_placement < 10) {
			return "Topp tio, riktigt bra placering!";
		} else if (overall_placement < CUTOFF) {
			return "Ändå bland de översta femtio, för chill!";
		}

		return "Inte ens topp femtio? Mer kaffe åt folket nästa termin";
	};

	return (
		<Element
			name="placement"
			className="bg-baljan-dark-blue sticky top-0 flex h-dvh w-screen flex-col items-center justify-center px-6"
		>
			<motion.h1
				className="font-title relative z-0 pt-8 text-center text-4xl text-white md:text-6xl xl:text-7xl"
				ref={ref}
			>
				Du hamnade på plats
				<br />
				<Counter
					gradientFrom="var(--color-baljan-dark-blue)"
					value={overall_placement + 1}
					fontSize={isMobile ? 112 : 160}
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
				className="mt-4 max-w-196 text-center font-sans text-xl/relaxed text-white md:mt-8 md:text-3xl/relaxed"
			>
				{getCongratulationsMessage()}
			</motion.p>
		</Element>
	);
};
