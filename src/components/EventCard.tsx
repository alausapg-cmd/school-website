import type { SchoolEvent } from "@/lib/types";

const PAGE = ["bg-coral", "bg-sky", "bg-grass", "bg-grape"];

export function EventCard({ event, past = false, i = 0 }: { event: SchoolEvent; past?: boolean; i?: number }) {
  const d = new Date(event.date);
  return (
    <div className={`card flex gap-4 ${past ? "opacity-75" : ""}`}>
      {/* A tear-off calendar page */}
      <div className="w-20 shrink-0 self-start overflow-hidden wobbly border-2 border-ink bg-white text-center shadow-[2px_3px_0_var(--color-ink)]">
        <div className={`${past ? "bg-ink/60" : PAGE[i % PAGE.length]} border-b-2 border-ink py-0.5 text-xs font-bold uppercase tracking-wider text-white`}>
          {d.toLocaleDateString("en-GB", { month: "short" })}
        </div>
        <div className="font-display text-4xl font-bold leading-[1.1]">{d.getDate()}</div>
        <div className="pb-1 text-xs font-semibold text-ink/60">{d.toLocaleDateString("en-GB", { weekday: "short" })}</div>
      </div>
      <div className="min-w-0 space-y-1">
        <h3 className="text-xl leading-snug">
          <span className="mr-1">{event.emoji}</span>
          {event.title}
        </h3>
        <p className="text-sm font-semibold text-ink/65">🕘 {event.time} · 📍 {event.location}</p>
        <p className="text-sm text-ink/80">{event.description}</p>
      </div>
    </div>
  );
}
