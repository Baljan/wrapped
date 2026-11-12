// Shared type scale for the slides, so every slide speaks with the same voice.
// Mobile first: the base size is for phones, md: and up is the desktop look.

/** Slide headline */
export const H1 =
	"font-title text-4xl/tight text-balance md:text-6xl/tight xl:text-7xl/tight";

/** The one big number a slide is built around. Always Lobster. */
export const HERO = "font-title text-8xl/none md:text-[10rem]/none";

/** Body copy under a headline */
export const BODY =
	"font-sans text-xl/relaxed text-pretty max-w-[34ch] md:text-3xl/relaxed";

/** Small print: labels, dates, footnotes */
export const CAPTION = "font-sans text-base md:text-xl";

/** A single caption line that shows up once the slide's animation is done */
export const afterAnimation = (delay: number) => ({
	initial: { opacity: 0 },
	whileInView: { opacity: 1 },
	transition: { delay, duration: 0.2 }
});
