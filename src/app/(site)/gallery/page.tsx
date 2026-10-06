import Image from "next/image";
import { PageHero } from "@/components/PageHero";

export const metadata = { title: "Gallery" };

const photos = [
  { src: "/images/building.jpg", w: 664, h: 336, caption: "Our school building" },
  { src: "/images/girls.jpg", w: 416, h: 310, caption: "Smart in our uniforms" },
  { src: "/images/pupils.jpg", w: 226, h: 258, caption: "Our little ones" },
  { src: "/images/play.jpg", w: 188, h: 258, caption: "Fun at the playground" },
];
const coming = [
  { emoji: "🙏", caption: "Thanksgiving service", bg: "bg-sky-soft" },
  { emoji: "🏃", caption: "Inter-house sports", bg: "bg-sun-soft" },
  { emoji: "🎓", caption: "Graduation day", bg: "bg-grass-soft" },
  { emoji: "🎄", caption: "Carol service", bg: "bg-coral-soft" },
];

export default function GalleryPage() {
  return (
    <>
      <PageHero emoji="📸" title="Gallery" text="Moments from life at Life Builders." color="bg-grass" />
      <section className="mx-auto max-w-6xl columns-1 gap-5 px-4 py-12 sm:columns-2 lg:columns-3">
        {photos.map((p) => (
          <figure key={p.src} className="card mb-5 break-inside-avoid overflow-hidden p-0">
            <Image src={p.src} alt={p.caption} width={p.w} height={p.h} className="w-full" />
            <figcaption className="px-5 py-3 font-display font-semibold">{p.caption}</figcaption>
          </figure>
        ))}
        {coming.map((p) => (
          <figure key={p.caption} className={`mb-5 break-inside-avoid overflow-hidden rounded-3xl ${p.bg}`}>
            <div className="grid h-48 place-items-center text-7xl">{p.emoji}</div>
            <figcaption className="bg-white/70 px-5 py-3 font-display font-semibold">{p.caption} <span className="text-sm font-normal text-ink/50">· photos coming soon</span></figcaption>
          </figure>
        ))}
      </section>
    </>
  );
}
