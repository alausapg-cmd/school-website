import type { SchoolEvent } from "@/lib/types";

export function EventCard({ event, past = false }: { event: SchoolEvent; past?: boolean }) {
  const d = new Date(event.date);
  return (
    <div className={`card flex gap-4 p-4 sm:p-5 ${past ? "opacity-70 saturate-50" : ""}`}>
      <div className="relative w-20 shrink-0 pt-3">
        <span className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 bg-wood-dark" aria-hidden />
        <div className="wood flex flex-col items-center justify-center rounded-2xl py-2 shadow-[0_4px_0_#4A2D12]">
          <span className="text-xs font-extrabold uppercase tracking-wider text-sun">{d.toLocaleDateString("en-GB", { month: "short" })}</span>
          <span className="font-display text-3xl font-extrabold leading-none">{d.getDate()}</span>
          <span className="text-xs">{d.toLocaleDateString("en-GB", { weekday: "short" })}</span>
        </div>
      </div>
      <div className="min-w-0 space-y-1">
        <h3 className="text-lg font-bold leading-snug">
          <span className="mr-1">{event.emoji}</span>
          {event.title}
        </h3>
        <p className="text-sm font-semibold text-sky">🕘 {event.time} · 📍 {event.location}</p>
        <p className="text-sm text-ink/75">{event.description}</p>
      </div>
    </div>
  );
}
