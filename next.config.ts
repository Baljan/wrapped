import type { NextConfig } from "next";

const BACKEND_URL =
	process.env.NODE_ENV === "production"
		? "https://www.baljan.org/auth/login/liu/"
		: "http://localhost:8000/admin/login/";
const NEXT_URL =
	process.env.NODE_ENV === "production"
		? "https://wrapped.baljan.org"
		: "http://localhost:3000";

const nextConfig: NextConfig = {
	async redirects() {
		return [
			{
				missing: [
					{ type: "cookie", key: "baljansessid" },
					{ type: "cookie", key: "csrftoken" }
				],
				source: "/",
				destination: `${BACKEND_URL}?next=${NEXT_URL}`,
				statusCode: 307
			}
		];
	}
};

export default nextConfig;
