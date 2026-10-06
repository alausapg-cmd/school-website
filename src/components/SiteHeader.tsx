"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type CSSProperties } from "react";
import { Logo } from "./Logo";

const links = [
  { href: "/", label: "Home", hl: "var(--color-sun)" },
  { href: "/about", label: "About us", hl: "#9EDDAE" },
  { href: "/news", label: "News", hl: "#FFB8B0" },
  { href: "/events", label: "Events", hl: "#C9B5F5" },
  { href: "/gallery", label: "Gallery", hl: "#9CC7FF" },
  { href: "/contact", label: "Admissions", hl: "var(--color-sun)" },
];

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b-2 border-dashed border-ink/25 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active(l.href) ? "page" : undefined}
              className="px-3 py-1.5 font-display text-[1.1rem] font-bold text-ink/80 transition hover:-rotate-2 hover:text-ink"
            >
              <span className={active(l.href) ? "highlight text-ink" : ""} style={{ "--hl": l.hl } as CSSProperties}>
                {l.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-sun hidden px-4 py-2 sm:inline-flex">
            ✏️ Learning Portal
          </Link>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="sketch grid h-11 w-11 place-items-center bg-paper text-xl shadow-[2px_2px_0_var(--color-ink)] lg:hidden"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {open && (
        <nav className="lined mx-3 mb-3 flex flex-col gap-0.5 wobbly border-2 border-ink py-2 pl-14 pr-4 shadow-[4px_4px_0_rgb(42_43_51/0.2)] lg:hidden" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-1 font-display text-xl font-bold leading-[1.6rem]"
            >
              <span className={active(l.href) ? "highlight" : ""} style={{ "--hl": l.hl } as CSSProperties}>{l.label}</span>
            </Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)} className="btn-sun my-2 -ml-10">
            ✏️ Learning Portal
          </Link>
        </nav>
      )}
    </header>
  );
}
