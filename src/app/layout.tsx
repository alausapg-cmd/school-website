import type { Metadata } from "next";
import { Caveat, Kalam, Lexend } from "next/font/google";
import { school } from "@/lib/school";
import "./globals.css";

const kalam = Kalam({ variable: "--font-kalam", subsets: ["latin"], weight: ["400", "700"] });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"] });
const lexend = Lexend({ variable: "--font-lexend", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: `${school.name} · ${school.tagline}`, template: `%s · ${school.name}` },
  description: `${school.name}, ${school.kind}. ${school.tagline}. Motto: ${school.motto}.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${kalam.variable} ${caveat.variable} ${lexend.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {/* Shared SVG filter: gives doodles a slightly shaky, hand-drawn line. */}
        <svg width="0" height="0" className="absolute" aria-hidden>
          <filter id="wobble">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="2.6" />
          </filter>
        </svg>
        {children}
      </body>
    </html>
  );
}
