import axios from "axios";
import { cookies } from "next/headers";

import data from "../_data.json";

export const loadWrappedData = async () => {
	// This will obv be removed in favor of some verison of the request below

	if (process.env.NODE_ENV !== "production") {
		return { success: true, data };
	}

	const cookieStore = await cookies();

	try {
		const resp = await axios.get("https://www.baljan.org/wrapped", {
			// Horrible solution but we ball
			headers: {
				Cookie: cookieStore
					.getAll()
					.map((c) => `${c.name}=${c.value}`)
					.join("; ")
			}
		});
		return { success: true, data: resp.data };
	} catch (err) {
		// Maybe we should handle specific errors, like 400, 401, but i think 400 is the only possible error tho
		return { success: false, data: {} };
	}
};
