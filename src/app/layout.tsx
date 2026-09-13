import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jade Solitaire — Mahjong demo",
  description:
    "Client demo of a mahjong tile-matching game: solvable boards, boosters, daily puzzle, shop, and offline progress.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${nunito.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
