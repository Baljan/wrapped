import type { Metadata } from "next";
import { Lobster } from "next/font/google";
import "./globals.css";

import localFont from "next/font/local";

const lobsterSans = Lobster({
	variable: "--font-lobster-sans",
	subsets: ["latin"],
	weight: "400"
});

const arialRoundedSans = localFont({
	src: "../public/Arial Rounded MT Regular.ttf",
	variable: "--font-arial-sans"
});

const arialRoundedBold = localFont({
	src: "../public/Arial Rounded MT Bold Regular.ttf",
	variable: "--font-arial-bold"
});

export const metadata: Metadata = {
	title: "Blippen Wrapped"
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${lobsterSans.variable} ${arialRoundedSans.variable} ${arialRoundedBold.variable} h-screen max-h-screen w-screen max-w-screen overflow-hidden antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
