import type { NextConfig } from "next";

// Fully static export: the site can be served from GitHub Pages (or any static
// file server). Login + data fetching happens client-side, see app/data.ts.
const nextConfig: NextConfig = {
	output: "export",
	images: {
		unoptimized: true
	},
	turbopack: {
		rules: {
			"*.svg": {
				loaders: ["@svgr/webpack"],
				as: "*.js"
			}
		}
	}
};

export default nextConfig;
