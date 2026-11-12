import { useWrappedContext } from "@/app/context";
import clsx from "clsx";
import {
	AnimationSequence,
	BezierDefinition,
	useAnimate,
	useInView
} from "motion/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Element } from "react-scroll";
import { Standout } from "./Standout";

const slamEasing: BezierDefinition = [0.45, 0, 1, 0.33];

type AnimationStep = {
	steps: AnimationSequence;
	delay: number;
};

export const FavCafe = () => {
	const [scope, animate] = useAnimate();
	const { fav_cafe, n_orders } = useWrappedContext();

	const is_baljan = fav_cafe.id == 0;
	const in_other_cafe = n_orders - fav_cafe.n_orders;
	const diff = fav_cafe.n_orders - in_other_cafe;

	const isInView = useInView(scope);
	const [step, setStep] = useState(0);
	const steps: AnimationStep[] = useMemo(
		() => [
			{
				delay: 0.5,
				steps: [
					[
						"#baljan-background",
						{ width: "50%" },
						{ duration: 0.7, ease: slamEasing }
					],
					[
						"#byttan-background",
						{ width: "50%" },
						{ duration: 0.7, ease: slamEasing, at: "<" }
					],
					// Next step
					[
						"#versus",
						{
							opacity: 1,
							fontSize: "20vh"
						},
						{ duration: 0.4, ease: slamEasing, at: "-0.4" }
					],
					["#baljan-logo", { opacity: 1 }, { duration: 0.4 }],
					["#byttan-logo", { opacity: 1 }, { duration: 0.4, at: "<" }]
				]
			},
			{
				delay: 3,
				steps: [
					[
						"#baljan-background",
						{ width: "100%" },
						{ duration: 1, ease: "easeOut" }
					],
					[
						"#byttan-background",
						{ width: "100%" },
						{ duration: 1, at: "<", ease: "easeOut" }
					],
					["#versus", { opacity: 0 }, { duration: 0.4, at: "<" }],
					[
						"#baljan-logo",
						is_baljan
							? {
									left: "50%",
									x: "-50%",
									top: "45%"
								}
							: {
									opacity: 0
								},
						{
							duration: is_baljan ? 1 : 0.1,
							at: "<",
							ease: is_baljan ? "easeInOut" : "easeIn"
						}
					],
					[
						"#byttan-logo",
						!is_baljan
							? {
									left: "50%",
									x: "-50%",
									top: "45%"
								}
							: {
									opacity: 0
								},
						{
							duration: !is_baljan ? 1 : 0.1,
							at: "<",
							ease: is_baljan ? "easeIn" : "easeInOut"
						}
					],
					[
						"#title",
						{
							opacity: 1
						},
						{ duration: 1, at: "<" }
					],
					[
						"#sub-title",
						{ opacity: 1 },
						{
							duration: 1,
							at: "<"
						}
					],
					[
						"#info",
						{ opacity: 1 },
						{
							duration: 1,
							at: "<"
						}
					]
				]
			}
		],
		[is_baljan]
	);

	useEffect(() => {
		const initialAnimations = async () => {
			if (isInView) {
				const seq = steps[step];

				setTimeout(async () => {
					await animate(seq.steps);
					setStep((_s) => {
						if (_s + 1 < steps.length) {
							return _s + 1;
						}
						return _s;
					});
				}, seq.delay * 1e3);
			}
		};

		initialAnimations();
	}, [scope, animate, step, steps, isInView]);

	return (
		<>
			<div className="h-24 w-full"></div>
			<Element
				name="favorite_cafe"
				className="sticky top-0 h-dvh w-screen overflow-hidden"
			>
				<div className="relative h-full w-full scale-115" ref={scope}>
					{/* On tall, narrow phone screens the skew would leave the corners
					    bare, so the halves are blown up there. A uniform scale keeps
					    the angle and the split in the middle. */}
					<div className="absolute inset-0 max-md:scale-175">
						<div
							id="baljan-background"
							className={clsx(
								"bg-baljan-pink absolute left-0 z-0 h-full -skew-x-12",
								is_baljan ? "z-10" : "z-0"
							)}
						></div>
						<div
							id="byttan-background"
							className={clsx(
								"bg-baljan-blue absolute right-0 z-0 h-full -skew-x-12",
								is_baljan ? "z-0" : "z-10"
							)}
						></div>
					</div>

					<h1
						id="versus"
						className="font-title absolute top-1/2 left-1/2 z-20 h-64 w-fit origin-center -translate-1/2 text-center text-6xl/[unset] leading-[unset] text-white opacity-0 max-md:scale-60 xl:text-8xl/[unset]"
					>
						VS
					</h1>
					<Image
						id="baljan-logo"
						src="/baljan_logga.png"
						alt="baljan logga"
						className="absolute top-1/2 left-[8%] z-20 w-[26vw] -translate-y-1/2 opacity-0 md:left-1/5 md:w-[25vh]"
						width={881}
						height={881}
					/>
					<Image
						id="byttan-logo"
						src="/byttan_logga.png"
						alt="byttan logga"
						className="absolute top-1/2 right-[8%] z-20 w-[26vw] -translate-y-1/2 opacity-0 md:right-1/5 md:w-[25vh]"
						width={881}
						height={881}
					/>
					<h2
						id="title"
						className="font-title absolute top-[20%] left-1/2 z-20 w-max -translate-x-1/2 text-3xl text-white opacity-0 md:w-auto md:text-6xl"
					>
						Ditt favoritcafé var:
					</h2>
					<h1
						id="sub-title"
						className="font-title absolute top-[60%] left-1/2 z-20 -translate-x-1/2 text-6xl text-white opacity-0 md:text-8xl"
					>
						{is_baljan ? "Baljan" : "Byttan"}
					</h1>
					<p
						id="info"
						className="absolute top-[75%] left-1/2 z-20 w-[72%] -translate-x-1/2 text-center text-lg text-white opacity-0 md:w-auto md:text-2xl"
					>
						{in_other_cafe == 0 ? (
							"Du drack alla dina koppar där!"
						) : (
							<>
								Du drack hela{" "}
								<Standout>{fav_cafe.n_orders} koppar </Standout>
								där, <Standout>{diff} koppar</Standout> fler än
								i<span> </span>
								{fav_cafe.id == 0 ? "Byttan" : "Baljan"}!
							</>
						)}
					</p>
				</div>
			</Element>
		</>
	);
};
