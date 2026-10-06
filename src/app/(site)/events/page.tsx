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
      <PageHero emoji="🎉" title="Events" text="Fun days, big celebrations and important dates to circle in crayon." tone="grape" pipSays="Don't forget your art smock!" />
      <section className="mx-auto max-w-4xl space-y-5 px-4 py-14">
        <h2 className="text-4xl">Coming up</h2>
        {upcoming.length ? upcoming.map((e, i) => <EventCard key={e.id} event={e} i={i} />) : <p>No upcoming events yet.</p>}
        {past.length > 0 && (
          <>
            <h2 className="pt-8 text-4xl">What we&apos;ve done</h2>
            {past.map((e) => <EventCard key={e.id} event={e} past />)}
          </>
        )}
      </section>
    </>
  );
}
