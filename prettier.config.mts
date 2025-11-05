// prettier.config.ts, .prettierrc.ts, prettier.config.mts, or .prettierrc.mts

import { type Config } from "prettier";

const config: Config = {
	plugins: ["prettier-plugin-tailwindcss"],
	tabWidth: 4,
	trailingComma: "none",
	useTabs: true
};

export default config;
