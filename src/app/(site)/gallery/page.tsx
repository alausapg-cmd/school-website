import { Scene, SCENES, type SceneId } from "@/components/Doodles";
import { PageHero } from "@/components/PageHero";

export const metadata = { title: "Gallery" };

const TILTS = ["-rotate-2", "rotate-2", "-rotate-1", "rotate-1", "rotate-3", "-rotate-3"];
const TAPES = ["#FFC83D", "#9CC7FF", "#9EDDAE", "#FFB8B0", "#C9B5F5"];

export default function GalleryPage() {
  const ids = Object.keys(SCENES) as SceneId[];
  return (
    <>
      <PageHero emoji="🖼️" title="Gallery" text="No cameras here: every picture is drawn by hand, just like our pupils' best work." tone="sun" pipSays="I drew the paper planes one!" />
      <section className="mx-auto grid max-w-6xl gap-x-8 gap-y-12 px-4 py-14 sm:grid-cols-2 lg:grid-cols-3">
        {ids.map((id, i) => (
          <figure key={id} className={`polaroid relative ${TILTS[i % TILTS.length]} transition hover:z-10 hover:rotate-0 hover:scale-[1.04]`}>
            <span className="tape" style={{ backgroundColor: TAPES[i % TAPES.length] }} aria-hidden />
            <Scene id={id} className="block h-auto w-full" />
            <figcaption className="mt-3 text-center font-scribble text-[1.7rem] leading-tight">{SCENES[id].label}</figcaption>
          </figure>
        ))}
      </section>
    </>
  );
}
