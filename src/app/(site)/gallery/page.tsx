import { PageHero } from "@/components/PageHero";
import { GALLERY } from "@/components/Scenes";

export const metadata = { title: "Gallery" };

const TILT = ["-rotate-1", "rotate-1", "rotate-0", "-rotate-2", "rotate-2", "-rotate-1", "rotate-1", "rotate-0"];

export default function GalleryPage() {
  return (
    <>
      <PageHero emoji="🖼️" title="Gallery" kicker="Snapshots from the jungle" text="Scenes from life at Owlberry, painted by our art club's favourite owl." color="bg-grass" fruit="berry" />
      <section className="mx-auto grid max-w-6xl gap-7 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERY.map(({ Scene, caption, text, tone }, i) => (
          <figure key={caption} className={`group relative ${TILT[i]} transition hover:rotate-0 hover:-translate-y-1`}>
            <span className="absolute -top-3 left-1/2 z-10 h-6 w-16 -translate-x-1/2 rotate-2 rounded-sm bg-sun/80 shadow" aria-hidden />
            <div className={`rounded-[1.5rem] ${tone} p-3 pb-0 shadow-[0_8px_0_rgba(90,56,24,0.12)] ring-2 ring-wood/10`}>
              <div className="overflow-hidden rounded-2xl ring-2 ring-white"><Scene /></div>
              <figcaption className="px-2 py-3">
                <span className="block font-display text-lg font-bold">{caption}</span>
                <span className="text-sm text-ink/70">{text}</span>
              </figcaption>
            </div>
          </figure>
        ))}
      </section>
    </>
  );
}
