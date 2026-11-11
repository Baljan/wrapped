import { WrappedData } from "./types";

const PROD = process.env.NODE_ENV === "production";

// Set NEXT_PUBLIC_BACKEND_URL=http://localhost:8000 to test against a local
// cafesys instead of the mock data in _data.json during `npm run dev`.
const BACKEND_URL =
	process.env.NEXT_PUBLIC_BACKEND_URL ??
	(PROD ? "https://www.baljan.org" : undefined);

export type LoadResult =
	| { status: "ok"; data: WrappedData }
	| { status: "no-data" }
	| { status: "error" };

// LiU login doesn't work against a local cafesys, use the admin login there.
const LOGIN_PATH = PROD ? "/auth/login/liu/" : "/admin/login/";

export const loginUrl = () =>
	`${BACKEND_URL}${LOGIN_PATH}?next=${encodeURIComponent(window.location.href)}`;

export const loadWrappedData = async (): Promise<
	LoadResult | { status: "login" }
> => {
	if (!PROD && !BACKEND_URL) {
		const mock = await import("../_data.json");
		return { status: "ok", data: mock.default as WrappedData };
	}

	try {
		const resp = await fetch(`${BACKEND_URL}/wrapped`, {
			credentials: "include",
			redirect: "manual"
		});

		if (resp.ok) {
			return { status: "ok", data: await resp.json() };
		}
		if (resp.status === 400) {
			return { status: "no-data" };
		}
		// 401 = not logged in. An opaque redirect (type "opaqueredirect") means
		// the backend wants the user somewhere else first, e.g. the GDPR
		// consent page — sending them through login handles both.
		if (resp.status === 401 || resp.type === "opaqueredirect") {
			return { status: "login" };
		}
		return { status: "error" };
	} catch {
		// Network/CORS failure, most likely a redirect to an HTML page.
		return { status: "login" };
	}
};
