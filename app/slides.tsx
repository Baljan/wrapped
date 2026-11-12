import { AmountOfCoffee } from "@/components/AmountOfCoffee";
import { Clock } from "@/components/Clock";
import { Comparison } from "@/components/Comparison";
import { End } from "@/components/End";
import { FastestRefill } from "@/components/FastestRefill";
import { FavCafe } from "@/components/FavCafe";
import { Leaderboard } from "@/components/Leaderboard";
import { MostPurchases } from "@/components/MostPurchases";
import { OnlineCards } from "@/components/OnlineCards";
import { Placement } from "@/components/Placement";
import { StaffShifts } from "@/components/StaffShifts";
import { Welcome } from "@/components/Welcome";
import { ComponentType } from "react";
import { parseDuration } from "./format";
import { WrappedData } from "./types";

export type Slide = {
	/** Must match the name of the slide's react-scroll <Element>. */
	name: string;
	lock_duration: number;
	Component: ComponentType;
	/** The slide's background color, used to paint its edge. */
	color?: string | ((data: WrappedData) => string);
	/** Torn receipt-style teeth along the top edge, otherwise the slide meets the previous one in a straight line. */
	edge?: "zigzag";
	/** Leave the slide out if there's no data for it. */
	include?: (data: WrappedData) => boolean;
};

const SLIDES: Slide[] = [
	{ name: "welcome", lock_duration: 0, Component: Welcome },
	{
		name: "amount_of_coffee",
		lock_duration: 5,
		Component: AmountOfCoffee,
		color: "var(--color-yellow-950)"
	},
	{
		name: "comparison",
		lock_duration: 5,
		Component: Comparison,
		color: "var(--color-caramel)",
		edge: "zigzag",
		include: (d) => (d.previous?.n_orders ?? 0) > 0
	},
	{
		name: "clock",
		lock_duration: 6,
		Component: Clock,
		color: "var(--color-baljan-dark-blue)",
		include: (d) => !!d.time_of_day
	},
	{
		name: "most_purchases",
		lock_duration: 5,
		Component: MostPurchases,
		color: "var(--color-green-600)"
	},
	{
		name: "fastest_refill",
		lock_duration: 4,
		Component: FastestRefill,
		color: "var(--color-baljan-pink)",
		include: (d) => parseDuration(d.shortest_delta) !== null
	},
	{
		name: "placement",
		lock_duration: 5,
		Component: Placement,
		color: "var(--color-baljan-dark-blue)"
	},
	{
		name: "leaderboard",
		lock_duration: 6,
		Component: Leaderboard,
		color: "var(--color-amber-400)",
		include: (d) => !!d.best_placement?.date
	},
	{
		name: "favorite_cafe",
		lock_duration: 7,
		Component: FavCafe,
		color: (d) =>
			d.fav_cafe.id == 0
				? "var(--color-baljan-pink)"
				: "var(--color-baljan-blue)"
	},
	{
		name: "online_cards",
		lock_duration: 5,
		Component: OnlineCards,
		color: "var(--color-latte)",
		include: (d) => !!d.online_cards
	},
	{
		name: "staff_shifts",
		lock_duration: 5,
		Component: StaffShifts,
		color: "var(--color-baljan-blue)",
		include: (d) =>
			d.is_staff &&
			!!d.shifts &&
			(d.shifts.count > 0 || d.shifts.on_call > 0)
	},
	{ name: "end", lock_duration: 0, Component: End }
];

export const slidesFor = (data: WrappedData) =>
	SLIDES.filter((s) => !s.include || s.include(data));

export const slideColor = (slide: Slide | undefined, data: WrappedData) =>
	typeof slide?.color === "function" ? slide.color(data) : slide?.color;
