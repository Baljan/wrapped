import type { Metadata } from "next";
import { Lobster } from "next/font/google";
import "./globals.css";

const lobsterSans = Lobster({
	variable: "--font-lobster-sans",
	subsets: ["latin"],
	weight: "400"
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
				className={`${lobsterSans.variable} h-screen w-screen overflow-hidden antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
