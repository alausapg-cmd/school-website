"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Admissions" },
];

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink/5 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-4 py-2 font-display font-medium transition ${
                active(l.href) ? "bg-sky-soft text-sky" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-sun hidden sm:inline-flex">
            🎒 Learning Portal
          </Link>
          <button
            aria-label="Open menu"
            onClick={() => setOpen((o) => !o)}
            className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-xl ring-2 ring-ink/10 md:hidden"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t-2 border-ink/5 px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`rounded-2xl px-4 py-3 font-display ${active(l.href) ? "bg-sky-soft text-sky" : ""}`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)} className="btn-sun mt-2">
            🎒 Learning Portal
          </Link>
        </nav>
      )}
    </header>
  );
}
