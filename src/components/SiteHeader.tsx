"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";

const links = [
  { href: "/", label: "Home", emoji: "🌳" },
  { href: "/about", label: "About", emoji: "🦉" },
  { href: "/news", label: "News", emoji: "📜" },
  { href: "/events", label: "Events", emoji: "🎪" },
  { href: "/gallery", label: "Gallery", emoji: "🖼️" },
  { href: "/contact", label: "Admissions", emoji: "🧭" },
];

const TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-1", "rotate-1"];

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
        <Logo />
        <nav aria-label="Main" className="relative hidden items-start gap-2 self-stretch lg:flex">
          {/* the rope the signs hang from */}
          <svg className="absolute inset-x-0 -top-1 h-5 w-full" viewBox="0 0 400 20" preserveAspectRatio="none" aria-hidden>
            <path d="M0 4 Q 100 16, 200 6 T 400 6" stroke="#8A5A2B" strokeWidth="3" fill="none" strokeDasharray="7 3" />
          </svg>
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active(l.href) ? "page" : undefined}
              className={`relative mt-4 origin-top rounded-xl px-3.5 py-1.5 font-display text-[0.95rem] font-bold transition hover:rotate-0 hover:-translate-y-0.5 ${TILTS[i]} before:absolute before:-top-3 before:left-3 before:h-3 before:w-0.5 before:bg-wood-dark after:absolute after:-top-3 after:right-3 after:h-3 after:w-0.5 after:bg-wood-dark ${
                active(l.href)
                  ? "wood shadow-[0_4px_0_#4A2D12]"
                  : "bg-[#F6E6C4] text-wood-dark shadow-[0_3px_0_rgba(90,56,24,0.25)] ring-1 ring-wood/30 hover:bg-sun-soft"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-berry hidden sm:inline-flex">
            🎒 Learning Portal
          </Link>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="wood grid h-11 w-11 place-items-center rounded-2xl text-xl shadow-[0_3px_0_#4A2D12] lg:hidden"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
      <svg className="block h-3 w-full text-wood" viewBox="0 0 1440 12" preserveAspectRatio="none" aria-hidden>
        <path d="M0 6 Q 180 12, 360 6 T 720 6 T 1080 6 T 1440 6" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="10 4" />
      </svg>
      {open && (
        <nav aria-label="Main" className="jungle-bg relative overflow-hidden px-4 pb-6 pt-3 lg:hidden">
          <div className="grid grid-cols-2 gap-3">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-2xl px-4 py-3 font-display text-lg font-bold ${i % 2 ? "rotate-1" : "-rotate-1"} ${
                  active(l.href) ? "bg-sun text-ink shadow-[0_4px_0_#B87800]" : "wood shadow-[0_4px_0_#4A2D12]"
                }`}
              >
                <span className="mr-1.5">{l.emoji}</span>
                {l.label}
              </Link>
            ))}
          </div>
          <Link href="/login" onClick={() => setOpen(false)} className="btn-berry mt-4 w-full text-lg">
            🎒 Learning Portal
          </Link>
        </nav>
      )}
    </header>
  );
}
