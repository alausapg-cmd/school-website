import type { Metadata } from "next";
import { Baloo_2, Lexend, Space_Mono } from "next/font/google";
import { school } from "@/lib/school";
import "./globals.css";

const baloo = Baloo_2({ variable: "--font-baloo", subsets: ["latin"], weight: ["500", "600", "700", "800"] });
const lexend = Lexend({ variable: "--font-lexend", subsets: ["latin"] });
const spaceMono = Space_Mono({ variable: "--font-spacemono", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: { default: `${school.name} · ${school.tagline}`, template: `%s · ${school.name}` },
  description: `${school.name}, a ${school.kind.toLowerCase()} in Lekki. ${school.motto}.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${baloo.variable} ${lexend.variable} ${spaceMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
