export interface WrappedData {
	is_staff: boolean;
	overall_placement: number;
	n_orders: number;
	caffeine_mg: number;
	most_purchases: MostPurchases;
	best_placement: BestPlacement;
	longest_streak: LongestStreak;
	shortest_delta: string;
	fav_cafe: FavCafe;
	week_avg: number;
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
	start: string;
	end: string;
	duration: number;
}

export interface FavCafe {
	id: number;
	n_orders: number;
}
