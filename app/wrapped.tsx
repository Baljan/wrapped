"use client";

import { Fragment, useMemo } from "react";
import { WrappedProvider } from "./context";
import { slideColor, slidesFor } from "./slides";
import { WrappedData } from "./types";

export const Wrapped = ({ data }: { data: WrappedData }) => {
	const slides = useMemo(() => slidesFor(data), [data]);
	const states = useMemo(
		() =>
			slides.map(({ name, lock_duration }) => ({ name, lock_duration })),
		[slides]
	);

	return (
		<WrappedProvider data={data} states={states}>
			{slides.map((slide, i) => {
				const from = slideColor(slides[i - 1], data);
				const to = slideColor(slide, data);

				return (
					<Fragment key={slide.name}>
						{slide.strip && from && to && (
							<div
								aria-hidden
								className="h-36 w-screen"
								style={{
									background: `linear-gradient(in oklch to bottom, ${from}, ${to})`
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
