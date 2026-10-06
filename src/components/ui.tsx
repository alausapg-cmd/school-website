import type { ReactNode } from "react";
import type { Subject } from "@/lib/types";

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

export function Empty({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-ink/15 p-10 text-center text-ink/60">
      <div className="text-5xl">{emoji}</div>
      <p className="mt-2 font-display text-lg">{text}</p>
    </div>
  );
}

export function Stat({ emoji, value, label, bg }: { emoji: string; value: ReactNode; label: string; bg: string }) {
  return (
    <div className={`rounded-3xl ${bg} p-5`}>
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
