import { PageHero } from "@/components/PageHero";

export const metadata = { title: "Gallery" };

const photos = [
  { emoji: "🔬", caption: "Science Fair 2026", bg: "bg-grass-soft", tall: true },
  { emoji: "🏃", caption: "Inter-house sports", bg: "bg-sun-soft" },
  { emoji: "🎭", caption: "Christmas nativity play", bg: "bg-coral-soft" },
  { emoji: "📚", caption: "World Book Day", bg: "bg-sky-soft", tall: true },
  { emoji: "🌳", caption: "Planting our garden", bg: "bg-grass-soft" },
  { emoji: "🎨", caption: "Art club masterpieces", bg: "bg-grape-soft" },
  { emoji: "🇳🇬", caption: "Cultural day", bg: "bg-grass-soft", tall: true },
  { emoji: "🎵", caption: "Choir performance", bg: "bg-sun-soft" },
  { emoji: "🏊", caption: "Swimming lessons", bg: "bg-sky-soft" },
];

export default function GalleryPage() {
  return (
    <>
      <PageHero emoji="📸" title="Gallery" text="Happy moments from school life. (Photos coming soon!)" color="bg-grass" />
      <section className="mx-auto max-w-6xl columns-1 gap-5 px-4 py-12 sm:columns-2 lg:columns-3">
        {photos.map((p) => (
          <figure key={p.caption} className={`mb-5 break-inside-avoid overflow-hidden rounded-3xl ${p.bg}`}>
            <div className={`grid place-items-center text-8xl ${p.tall ? "h-80" : "h-52"}`}>{p.emoji}</div>
            <figcaption className="bg-white/70 px-5 py-3 font-display font-semibold">{p.caption}</figcaption>
          </figure>
        ))}
      </section>
    </>
  );
}
