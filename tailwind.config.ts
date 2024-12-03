import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import daisyui from "daisyui";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/data/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			height: {
				"100": "25rem",
				"104": "26rem",
				"108": "27rem",
				"112": "28rem",
				"116": "29rem",
				"120": "30rem",
				"124": "31rem",
				"128": "32rem",
				"132": "33rem",
				"136": "34rem",
				"140": "35rem",
				"144": "36rem",
				"148": "37rem",
				"152": "38rem",
				"156": "39rem",
				"160": "40rem",
				"164": "41rem",
				"168": "42rem",
				"172": "43rem",
				"176": "44rem",
				"180": "45rem",
				"184": "46rem",
				"188": "47rem",
				"192": "48rem",
				"196": "49rem",
				"200": "50rem",
			},
		},
	},
	daisyui: {
		themes: [
			{
				potluck: {
					primary: "#FF8A50", // Slightly muted orange for vibrancy on dark
					secondary: "#4CAF50", // Deep green with good contrast
					accent: "#FFB74D", // Rich golden-yellow for highlights
					neutral: "#3E2723", // Dark brown for a warm neutral base
					"base-100": "#212121", // Dark gray for background
					info: "#1E88E5", // Deep blue for informational tones
					success: "#66BB6A", // Calm green for success indicators
					warning: "#FFB300", // Bold amber for warnings
					error: "#D32F2F", // Deep red for errors
				},
			},
		],
	},
	plugins: [typography, daisyui],
};
export default config;
