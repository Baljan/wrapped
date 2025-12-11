"use client";

import { createContext, ReactNode, useContext } from "react";
import { WrappedData } from "./types";

export type WrappedContextSchema = WrappedData;

const WrappedContext = createContext<WrappedContextSchema>({
	is_staff: true,
	overall_placement: 8,
	n_orders: 162,
	caffeine_mg: 39204,
	most_purchases: {
		count: 5,
		dates: ["2025-09-23", "2025-08-29", "2025-09-30"]
	},
	best_placement: {
		date: "2025-09-30",
		count: 5,
		place: 0,
		shared: 0,
		other_dates: ["2025-08-18", "2025-09-17"]
	},
	longest_streak: {
		start: "2025-08-26",
		end: "2025-09-01",
		duration: 5
	},
	shortest_delta: "0:00:05.863673",
	fav_cafe: {
		id: 0,
		n_orders: 146
	},
	week_avg: 1.82
});

export const useWrappedContext = () => useContext(WrappedContext);

export const WrappedProvider = ({
	children,
	data
}: {
	children: ReactNode;
	data: WrappedData;
}) => {
	return (
		<WrappedContext.Provider value={data}>
			{children}

			{process.env.NODE_ENV !== "production" && (
				<pre>
					<code>{JSON.stringify(data, null, 4)}</code>
				</pre>
			)}
		</WrappedContext.Provider>
	);
};

export default WrappedContext;
