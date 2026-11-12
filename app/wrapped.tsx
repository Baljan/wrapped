"use client";

import { Fragment, useMemo } from "react";
import { WrappedProvider } from "./context";
import { slideColor, slidesFor } from "./slides";
import { WrappedData } from "./types";

// Same teeth as the bottom of the receipt: 24px wide, 10px deep
const TOOTH_WIDTH = 24;
const TOOTH_DEPTH = 10;
const TOOTH_ANGLE =
	2 * Math.atan(TOOTH_WIDTH / 2 / TOOTH_DEPTH) * (180 / Math.PI);

export const Wrapped = ({ data }: { data: WrappedData }) => {
	const slides = useMemo(() => slidesFor(data), [data]);
	const states = useMemo(
		() =>
			slides.map(({ name, lock_duration }) => ({ name, lock_duration })),
		[slides]
	);

	return (
		<WrappedProvider data={data} states={states}>
			{slides.map((slide) => {
				const color = slideColor(slide, data);

				return (
					<Fragment key={slide.name}>
						{slide.edge === "zigzag" && color && (
							<div
								aria-hidden
								// Sticky slides paint above static blocks, lift the edge over them.
								// -mb-px hides the antialiasing seam against the slide below.
								className="relative z-[1] -mb-px w-screen"
								style={{
									height: TOOTH_DEPTH + 1,
									background: color,
									maskImage: `conic-gradient(from ${180 - TOOTH_ANGLE / 2}deg at top, #000 ${TOOTH_ANGLE}deg, #0000 0)`,
									maskSize: `${TOOTH_WIDTH}px 100%`,
									maskRepeat: "repeat-x",
									maskPosition: "center top"
								}}
							/>
						)}
						<slide.Component />
					</Fragment>
				);
			})}
		</WrappedProvider>
	);
};
