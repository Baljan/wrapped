import axios from "axios";
import { cookies } from "next/headers";

import data from "../_data.json";

export const loadWrappedData = async () => {
	// This will obv be removed in favor of some verison of the request below
	return data;

	const cookieStore = await cookies();

	const resp = await axios.get("http://localhost:8000/wrapped", {
		// Horrible solution but we ball
		headers: {
			Cookie: cookieStore
				.getAll()
				.map((c) => `${c.name}=${c.value}`)
				.join("; ")
		}
	});

	return resp.data;
};
