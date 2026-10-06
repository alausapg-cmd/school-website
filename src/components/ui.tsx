import type { ReactNode } from "react";
import type { Subject } from "@/lib/types";
import { Pip, Squiggle } from "./Doodles";

export function SubjectChip({ subject }: { subject?: Subject }) {
  if (!subject) return null;
  return (
    <span className="chip border-[1.5px]" style={{ background: `${subject.color}1f`, color: subject.color, borderColor: `${subject.color}66` }}>
      {subject.emoji} {subject.name}
    </span>
  );
}

export function PageHeader({ emoji, title, text, children }: { emoji: string; title: string; text?: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="page-title flex items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 -rotate-6 place-items-center wobbly border-2 border-ink bg-sun-soft text-2xl shadow-[2px_2px_0_var(--color-ink)]" aria-hidden>
            {emoji}
          </span>
          {title}
        </h1>
        <Squiggle className="ml-16 mt-0.5 h-3 w-28" />
        {text && <p className="mt-1 text-ink/70">{text}</p>}
      </div>
      {children}
    </div>
  );
}

export function Empty({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 wobbly border-2 border-dashed border-ink/30 bg-paper/70 px-6 py-8 text-center text-ink/70 sm:flex-row sm:text-left">
      <Pip className="h-24 w-auto shrink-0" mood="sleepy" wave={false} />
      <div>
        <div className="text-4xl">{emoji}</div>
        <p className="mt-1 font-display text-xl leading-snug">{text}</p>
      </div>
    </div>
  );
}

const STICKY: Record<string, string> = {
  "bg-sun-soft": "#FFE98A",
  "bg-sky-soft": "#BFDBFF",
  "bg-grass-soft": "#BDEBC9",
  "bg-coral-soft": "#FFC9C2",
  "bg-grape-soft": "#DCCBFF",
};

export function Stat({ emoji, value, label, bg }: { emoji: string; value: ReactNode; label: string; bg: string }) {
  const tilt = label.length % 3 === 0 ? "-rotate-2" : label.length % 3 === 1 ? "rotate-1" : "rotate-2";
  return (
    <div className={`sticky-note ${tilt} transition hover:rotate-0`} style={{ background: STICKY[bg] ?? "#FFE98A" }}>
      <span className="tape w-16 bg-white/60!" aria-hidden />
      <div className="flex items-start justify-between gap-2">
        <div className="font-display text-4xl font-bold leading-none">{value}</div>
        <div className="text-3xl leading-none">{emoji}</div>
      </div>
      <div className="mt-2 font-display text-[1.05rem] font-bold leading-tight text-ink/80">{label}</div>
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
  return <div className={`mb-6 wobbly border-2 border-current px-5 py-3 font-display text-lg font-bold ${cls}`}>{children}</div>;
}
