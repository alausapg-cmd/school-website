import { NewsCard } from "@/components/NewsCard";
import { PageHero } from "@/components/PageHero";
import { getDB } from "@/lib/db";

export const metadata = { title: "News" };

export default async function NewsPage() {
  const db = await getDB();
  const news = [...db.news].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHero emoji="📜" title="Treehouse News" kicker="Hot off the branches" text="Stories, celebrations and updates from around Owlberry." color="bg-coral" fruit="mango" />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3">
        {news.map((n) => <NewsCard key={n.id} post={n} />)}
      </section>
    </>
  );
}
