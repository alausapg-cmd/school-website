import { NewsCard } from "@/components/NewsCard";
import { PageHero } from "@/components/PageHero";
import { getDB } from "@/lib/db";

export const metadata = { title: "News" };

export default async function NewsPage() {
  const db = await getDB();
  const news = [...db.news].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHero emoji="📰" title="School news" text="Stories, celebrations and updates, hot off the classroom printer." tone="coral" pipSays="I wrote some of these myself!" />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-3">
        {news.map((n, i) => <NewsCard key={n.id} post={n} i={i} />)}
      </section>
    </>
  );
}
