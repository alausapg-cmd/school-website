import { PageHero } from "@/components/PageHero";
import { MissionScene } from "@/components/space/Scenes";

export const metadata = { title: "Gallery" };

const photos = [
  { kind: "launch", caption: "Water-rocket launch day", note: "Primary 5 sent a bottle rocket higher than the flagpole." },
  { kind: "reading", caption: "Story time on the moon", note: "Our reading nook, as drawn by Primary 3." },
  { kind: "sports", caption: "Planet sports day", note: "Team Orion and Team Lyra raced for the Comet Cup." },
  { kind: "art", caption: "Galaxy art studio", note: "Swirls, splats and a lot of purple paint." },
  { kind: "garden", caption: "The star garden", note: "Every class grows something new each term." },
  { kind: "observatory", caption: "Rooftop observatory night", note: "We spotted the moon's craters through the telescope." },
  { kind: "music", caption: "Cosmic concert", note: "Drums, recorders and a very loud finale." },
  { kind: "culture", caption: "Cultural day parade", note: "Songs, dances and food from across Nigeria." },
  { kind: "graduation", caption: "Primary 6 graduation", note: "Hats in the air for our newest graduates!" },
];

export default function GalleryPage() {
  return (
    <>
      <PageHero emoji="📸" kicker="Mission photos" title="Gallery" text="Snapshots of life on Planet Novaridge, illustrated by our art club." color="bg-sun" />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((p, i) => (
          <figure
            key={p.kind}
            className={`group rounded-[1.5rem] bg-white p-3 pb-4 shadow-[0_8px_0_rgba(58,63,191,0.08)] ring-2 ring-ink/5 transition hover:z-10 hover:rotate-0 hover:scale-[1.03] ${["-rotate-1", "rotate-1", "rotate-0"][i % 3]}`}
          >
            <div className="relative overflow-hidden rounded-2xl">
              <MissionScene kind={p.kind} className="aspect-[400/260] w-full transition duration-700 group-hover:scale-105" title={p.caption} />
              <span className="kicker absolute left-3 top-3 rounded-full bg-night/70 px-2.5 py-1 text-[0.6rem] text-white">Mission {String(i + 1).padStart(2, "0")}</span>
            </div>
            <figcaption className="px-2 pt-3">
              <span className="block font-display text-lg font-extrabold">{p.caption}</span>
              <span className="text-sm text-ink/65">{p.note}</span>
            </figcaption>
          </figure>
        ))}
      </section>
    </>
  );
}
