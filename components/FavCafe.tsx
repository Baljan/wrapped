import { AnimationSequence, BezierDefinition, useAnimate } from "motion/react";
import { useEffect } from "react";

export const FavCafe = () => {
	const [scope, animate] = useAnimate();

	useEffect(() => {
		const playAnimations = async () => {
			const slamEasing: BezierDefinition = [0.45, 0, 1, 0.33];
			const seq: AnimationSequence = [
				["#left", { left: 0 }, { duration: 0.7, ease: slamEasing }],
				[
					"#right",
					{ right: 0 },
					{ duration: 0.7, ease: slamEasing, at: "<" }
				],
				// Next step
				[
					"#title",
					{ opacity: 1, fontSize: "16rem" },
					{ duration: 0.4, ease: slamEasing, at: "-0.4" }
				]
			];

			await animate(seq);
		};

		playAnimations();
	}, [scope, animate]);

	return (
		<div
			ref={scope}
			className="relative h-screen w-screen overflow-hidden bg-transparent"
		>
			<div className="h-full w-full scale-115">
				<div
					id="left"
					className="absolute -left-[50vw] z-0 h-screen w-[50vw] -skew-x-12 bg-blue-500"
				></div>
				<div
					id="right"
					className="absolute -right-[50vw] z-0 h-screen w-[50vw] -skew-x-12 bg-pink-500"
				></div>
				{/* <div className="absolute top-0 right-0 bottom-0 left-0 z-10 flex items-center justify-evenly bg-transparent"> */}
				<h1
					id="title"
					className="absolute top-1/2 left-1/2 -translate-1/2 font-sans text-9xl opacity-0"
				>
					VS
				</h1>
				{/* </div> */}
			</div>
		</div>
	);
};
