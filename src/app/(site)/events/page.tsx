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
      <PageHero emoji="🎪" title="Events" kicker="Adventures ahead" text="Fun days, big celebrations and important dates for Owlberry families." color="bg-grape" fruit="berry" />
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="text-3xl font-extrabold">🌿 Coming up</h2>
        <div className="relative mt-5 space-y-5 border-l-4 border-dashed border-grass/50 pl-5 sm:pl-8">
          {upcoming.length ? upcoming.map((e) => <EventCard key={e.id} event={e} />) : <p>No upcoming events yet.</p>}
        </div>
        {past.length > 0 && (
          <>
            <h2 className="pt-12 text-3xl font-extrabold">🍂 What we&apos;ve done</h2>
            <div className="mt-5 space-y-5 border-l-4 border-dashed border-wood/30 pl-5 sm:pl-8">
              {past.map((e) => <EventCard key={e.id} event={e} past />)}
            </div>
          </>
        )}
      </section>
    </>
  );
}
