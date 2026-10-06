import type { SchoolEvent } from "@/lib/types";

export function EventCard({ event, past = false }: { event: SchoolEvent; past?: boolean }) {
  const d = new Date(event.date);
  return (
    <div className={`card flex gap-4 ${past ? "opacity-70" : ""}`}>
      <div className="flex w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-coral-soft py-2 text-coral">
        <span className="text-xs font-bold uppercase">{d.toLocaleDateString("en-GB", { month: "short" })}</span>
        <span className="font-display text-3xl font-bold leading-none">{d.getDate()}</span>
        <span className="text-xs">{d.toLocaleDateString("en-GB", { weekday: "short" })}</span>
      </div>
      <div className="min-w-0 space-y-1">
        <h3 className="text-lg font-semibold leading-snug">
          <span className="mr-1">{event.emoji}</span>
          {event.title}
        </h3>
        <p className="text-sm text-ink/60">🕘 {event.time} · 📍 {event.location}</p>
        <p className="text-sm text-ink/80">{event.description}</p>
      </div>
    </div>
  );
}
