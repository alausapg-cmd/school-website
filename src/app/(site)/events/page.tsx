import { EventCard } from "@/components/EventCard";
import { PageHero } from "@/components/PageHero";
import { getDB } from "@/lib/db";
import { today } from "@/lib/format";

export const metadata = { title: "Events" };

export default async function EventsPage() {
  const db = await getDB();
  const now = today();
  const upcoming = db.events.filter((e) => e.date >= now).sort((a, b) => a.date.localeCompare(b.date));
  const past = db.events.filter((e) => e.date < now).sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHero emoji="🗓️" kicker="Launch schedule" title="Events" text="Fun days, big celebrations and important dates for families." color="bg-glow" />
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="flex items-center gap-3 text-3xl font-extrabold"><span className="chip bg-coral text-white">Next up</span> Coming launches</h2>
        <div className="relative mt-6 space-y-4 sm:border-l-2 sm:border-dashed sm:border-sky/25 sm:pl-8">
          {upcoming.length ? upcoming.map((e) => (
            <div key={e.id} className="relative">
              <span aria-hidden className="absolute -left-[2.6rem] top-8 hidden text-xl text-sun sm:block">✦</span>
              <EventCard event={e} />
            </div>
          )) : <p>No upcoming events yet.</p>}
        </div>
        {past.length > 0 && (
          <>
            <h2 className="pt-12 text-3xl font-extrabold">Missions completed</h2>
            <div className="mt-6 space-y-4">
              {past.map((e) => <EventCard key={e.id} event={e} past />)}
            </div>
          </>
        )}
      </section>
    </>
  );
}
