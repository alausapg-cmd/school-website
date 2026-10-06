import type { ReactNode } from "react";
import type { Subject } from "@/lib/types";
import { Nova } from "./space/Art";

export function SubjectChip({ subject }: { subject?: Subject }) {
  if (!subject) return null;
  return (
    <span className="chip" style={{ background: `${subject.color}1f`, color: subject.color }}>
      {subject.emoji} {subject.name}
    </span>
  );
}

export function PageHeader({ emoji, title, text, children }: { emoji: string; title: string; text?: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="kicker mb-1 text-coral">Mission Control</p>
        <h1 className="page-title">
          <span className="mr-2">{emoji}</span>
          {title}
        </h1>
        {text && <p className="mt-1 text-ink/60">{text}</p>}
      </div>
      {children}
    </div>
  );
}

// Empty states: Nova the rocket floats by with a little message.
export function Empty({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-[1.75rem] border-2 border-dashed border-sky/25 bg-sky-soft/40 px-6 py-8 text-center sm:flex-row sm:text-left">
      <Nova className="h-24 w-auto shrink-0 animate-bob" flame={false} />
      <div className="relative">
        <span className="chip bg-white text-sky ring-2 ring-sky/15">{emoji} Nova says</span>
        <p className="mt-2 font-display text-lg font-semibold text-ink/80">{text}</p>
      </div>
    </div>
  );
}

export function Stat({ emoji, value, label, bg }: { emoji: string; value: ReactNode; label: string; bg: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[1.75rem] ${bg} p-5`}>
      <span aria-hidden className="absolute right-3 top-3 text-sm text-ink/15">✦</span>
      <span aria-hidden className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-white/50" />
      <div className="text-3xl">{emoji}</div>
      <div className="mt-1 font-display text-3xl font-bold">{value}</div>
      <div className="text-sm font-semibold text-ink/70">{label}</div>
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
  return <div className={`mb-6 rounded-2xl px-5 py-3 font-display font-semibold ${cls}`}>{children}</div>;
}
