export interface WrappedData {
	semester?: string;
	is_staff: boolean;
	overall_placement: number;
	n_orders: number;
	caffeine_mg: number;
	most_purchases: MostPurchases;
	best_placement: BestPlacement;
	longest_streak: LongestStreak;
	shortest_delta: string | null;
	fav_cafe: FavCafe;
	week_avg: number;
	// Added for HT2026. Optional since older Wrapped rows don't have them.
	online_cards?: OnlineCards;
	previous?: PreviousSemester | null;
	time_of_day?: TimeOfDay;
	shifts?: Shifts | null;
}

export interface MostPurchases {
	count: number;
	dates: string[];
}

export interface BestPlacement {
	date: string;
	count: number;
	place: number;
	shared: number;
	other_dates: string[];
}

export interface LongestStreak {
	start: string | null;
	end: string | null;
	duration: number;
}

export interface FavCafe {
	id: number;
	n_orders: number;
}

export interface OnlineCards {
	count: number;
	by_product: Record<string, number>;
}

export interface PreviousSemester {
	semester: string;
	n_orders: number;
}

export interface TimeOfDay {
	/** Blipps per hour of the day, local time, index 0-23. */
	hours: number[];
	/** Blipps per weekday, index 0 = Monday. */
	weekdays: number[];
	fav_hour: number;
	fav_weekday: number;
}

export interface Shifts {
	count: number;
	by_span: { morning: number; lunch: number; afternoon: number };
	exam_period: number;
	on_call: number;
}
