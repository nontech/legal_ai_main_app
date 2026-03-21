import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AnalyticsScripts from "@/app/components/AnalyticsScripts";
import PostHogProvider from "@/app/components/PostHogProvider";

const fontDisplay = Newsreader({
	subsets: ["latin"],
	variable: "--font-ui-serif",
	display: "swap",
});

const fontSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-ui-sans",
	display: "swap",
});

export const metadata: Metadata = {
	title:
		"Advanced AI-powered legal case outcome analysis and scenario prediction model",
	description:
		"We aim to simplify litigation so that anyone, regardless of legal background, can be understood on the merits of their case. By reducing cost barriers and procedural complexity, we empower individuals and professionals to pursue fair outcomes through TheLawThing.",
	icons: {
		icon: [{ url: "/favicon.ico", sizes: "any" }],
		shortcut: "/favicon.ico",
		apple: "/favicon.ico",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
<<<<<<< HEAD
			<body className="antialiased" suppressHydrationWarning>
				<PostHogProvider>
					{children}
				</PostHogProvider>
=======
			<body
				className={`${fontDisplay.variable} ${fontSans.variable} font-sans antialiased`}
				suppressHydrationWarning
			>
				{children}
>>>>>>> 5be28cc35f30ce488d79b0cedba6b7c177c66cb8
				<AnalyticsScripts />
			</body>
		</html>
	);
}
