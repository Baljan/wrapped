import axios from "axios";
import { cookies } from "next/headers";

export const loadWrappedData = async () => {
	const cookieStore = await cookies();

	const resp = await axios.get("http://localhost:8000/wrapped", {
		headers: {
			Cookie: cookieStore
				.getAll()
				.map((c) => `${c.name}=${c.value}`)
				.join("; ")
		}
	});

	return resp.data;
};
