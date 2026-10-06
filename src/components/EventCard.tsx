import { today } from "@/lib/format";
import type { SchoolEvent } from "@/lib/types";

function daysUntil(iso: string) {
  return Math.round((new Date(iso).getTime() - new Date(today()).getTime()) / 86400000);
}

export function EventCard({ event, past = false }: { event: SchoolEvent; past?: boolean }) {
  const d = new Date(event.date);
  const n = daysUntil(event.date);
  const countdown = past ? "Mission complete ✓" : n === 0 ? "Launching today!" : n === 1 ? "T-minus 1 day" : `T-minus ${n} days`;
  return (
    <div className={`card flex gap-4 overflow-hidden p-0 ${past ? "opacity-75" : ""}`}>
      <div className="night relative flex w-24 shrink-0 flex-col items-center justify-center py-4 text-center">
        <div aria-hidden className="stars absolute inset-0 opacity-60" />
        <span className="relative kicker text-star">{d.toLocaleDateString("en-GB", { month: "short" })}</span>
        <span className="relative font-display text-4xl font-extrabold leading-none">{d.getDate()}</span>
        <span className="relative text-xs text-white/70">{d.toLocaleDateString("en-GB", { weekday: "short" })}</span>
        <span aria-hidden className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-cream" />
      </div>
      <div className="min-w-0 space-y-1 py-4 pr-5">
        <span className={`chip ${past ? "bg-grass-soft text-grass" : "bg-coral-soft text-coral"}`}>{countdown}</span>
        <h3 className="text-lg font-bold leading-snug">
          <span className="mr-1">{event.emoji}</span>
          {event.title}
        </h3>
        <p className="text-sm text-ink/60">🕘 {event.time} · 📍 {event.location}</p>
        <p className="text-sm text-ink/80">{event.description}</p>
      </div>
    </div>
  );
}
