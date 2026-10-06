import type { Metadata } from "next";
import { Baloo_2, Caveat, Mulish } from "next/font/google";
import { school } from "@/lib/school";
import "./globals.css";

const baloo = Baloo_2({ variable: "--font-baloo", subsets: ["latin"] });
const mulish = Mulish({ variable: "--font-mulish", subsets: ["latin"] });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], weight: ["600", "700"] });

export const metadata: Metadata = {
  title: { default: `${school.name} · ${school.tagline}`, template: `%s · ${school.shortName}` },
  description: `${school.name}: ${school.tagline}. ${school.kind}.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${baloo.variable} ${mulish.variable} ${caveat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
