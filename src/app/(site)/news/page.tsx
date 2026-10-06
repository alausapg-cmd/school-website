import { NewsCard } from "@/components/NewsCard";
import { PageHero } from "@/components/PageHero";
import { getDB } from "@/lib/db";

export const metadata = { title: "News" };

export default async function NewsPage() {
  const db = await getDB();
  const news = [...db.news].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHero emoji="📰" title="School news" text="Stories, celebrations and updates from around our school." color="bg-coral" />
      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-12 md:grid-cols-3">
        {news.map((n) => <NewsCard key={n.id} post={n} />)}
      </section>
    </>
  );
}
