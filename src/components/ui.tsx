import type { ReactNode } from "react";
import type { Subject } from "@/lib/types";
import { Fruit, Leaf } from "./Jungle";
import { Owl } from "./Owl";

export function SubjectChip({ subject }: { subject?: Subject }) {
  if (!subject) return null;
  return (
    <span className="chip" style={{ background: `${subject.color}1f`, color: subject.color }}>
      {subject.emoji} {subject.name}
    </span>
  );
}

const KINDS = ["mango", "berry", "lime", "plum"];
const kindFor = (s: string) => KINDS[[...s].reduce((t, c) => t + (c.codePointAt(0) ?? 0), 0) % KINDS.length];

export function PageHeader({ emoji, title, text, children }: { emoji: string; title: string; text?: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="flex min-w-0 items-center gap-4">
        <Fruit kind={kindFor(title)} className="h-16 w-16 shrink-0 text-3xl">{emoji}</Fruit>
        <div className="min-w-0">
          <h1 className="page-title">{title}</h1>
          <svg viewBox="0 0 160 10" className="h-2.5 w-36" aria-hidden>
            <path d="M2 6 C 30 0, 60 10, 90 4 S 140 2, 158 6" stroke="#3A8A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="158" cy="6" r="3.5" fill="#C2185B" />
          </svg>
          {text && <p className="mt-1 text-ink/65">{text}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export function Empty({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border-4 border-dashed border-grass/30 bg-grass-soft/40 px-6 py-8 text-center text-ink/70">
      <Leaf className="absolute -left-2 -top-3 h-14 w-10 rotate-[150deg] opacity-30" />
      <Leaf className="absolute -bottom-4 -right-1 h-14 w-10 -rotate-12 opacity-30" color="#7CC24A" />
      <div className="relative mx-auto flex w-fit items-end">
        <Owl className="h-20 w-20" hat={false} />
        <span className="-ml-3 mb-1 text-4xl">{emoji}</span>
      </div>
      <p className="relative mt-2 font-display text-lg font-semibold">{text}</p>
    </div>
  );
}

const STAT_FRUIT: Record<string, string> = { "bg-sun-soft": "mango", "bg-coral-soft": "berry", "bg-grape-soft": "plum", "bg-grass-soft": "lime", "bg-sky-soft": "lime" };

export function Stat({ emoji, value, label, bg }: { emoji: string; value: ReactNode; label: string; bg: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[1.75rem] ${bg} p-5 ring-2 ring-wood/10`}>
      <Leaf className="absolute -right-3 -top-4 h-16 w-12 rotate-[30deg] opacity-15" />
      <Fruit kind={STAT_FRUIT[bg] ?? "mango"} className="h-12 w-12 text-2xl">{emoji}</Fruit>
      <div className="mt-2 font-display text-3xl font-extrabold leading-none">{value}</div>
      <div className="mt-1 text-sm font-semibold text-ink/70">{label}</div>
    </div>
  );
}

export function Stars({ count, max = 3 }: { count: number; max?: number }) {
  return (
    <span aria-label={`${count} of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < count ? "" : "opacity-20 grayscale"}>⭐</span>
      ))}
    </span>
  );
}

export function Notice({ children, tone = "grass" }: { children: ReactNode; tone?: "grass" | "coral" | "sky" }) {
  const cls = { grass: "bg-grass-soft text-grass", coral: "bg-coral-soft text-coral", sky: "bg-sky-soft text-sky" }[tone];
  return <div className={`mb-6 rounded-2xl px-5 py-3 font-display font-semibold ring-2 ring-current/15 ${cls}`}>{children}</div>;
}

// A jungle banner with Professor Hoot, for portal dashboards.
export function HootBanner({ title, text, children }: { title: ReactNode; text?: ReactNode; children?: ReactNode }) {
  return (
    <div className="jungle-bg relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
      <Leaf className="absolute -left-4 -top-6 h-24 w-16 rotate-[150deg] opacity-40" color="#7CC24A" />
      <Leaf className="absolute bottom-[-2rem] right-40 h-24 w-16 rotate-12 opacity-30" />
      <div className="relative flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
          {text && <div className="mt-1 text-lg text-white/85">{text}</div>}
          {children}
        </div>
        <Owl wave className="h-24 w-24 shrink-0 sm:h-32 sm:w-32" />
      </div>
    </div>
  );
}
