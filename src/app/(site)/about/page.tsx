import { C, LogoMark, Pip, Scene, Squiggle } from "@/components/Doodles";
import { PageHero } from "@/components/PageHero";
import { school } from "@/lib/school";

export const metadata = { title: "About us" };

const values = [
  { emoji: "💡", title: "Curiosity", text: "We ask why, how and what if, every single day.", bg: "#FFE98A", tilt: "-rotate-2" },
  { emoji: "🤝", title: "Kindness", text: "We share the crayons, take turns and look after each other.", bg: "#BFDBFF", tilt: "rotate-1" },
  { emoji: "🌈", title: "Courage", text: "We try new things and learn that mistakes help us grow.", bg: "#BDEBC9", tilt: "-rotate-1" },
  { emoji: "⭐", title: "Pride in our work", text: "We take our time, do our best and sign our name with a smile.", bg: "#FFC9C2", tilt: "rotate-2" },
];

const stages = [
  { emoji: "🧸", name: "Creche", ages: "6 months to 2 years", text: "Cuddles, songs, messy play and gentle routines in a calm, safe room.", color: "border-coral" },
  { emoji: "🖍️", name: "Nursery", ages: "2 to 5 years", text: "Phonics, counting, outdoor play and first marks on paper.", color: "border-sun" },
  { emoji: "📐", name: "Primary", ages: "Primary 1 to 6", text: "Confident readers, writers and problem-solvers ready for secondary school.", color: "border-sky" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero emoji="🏫" title="About our school" text={school.tagline + ". Here's a peek inside our sketchbook."} tone="grass" pipSays="Hi! I'm Pip, the school pencil." />

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 md:grid-cols-2">
        <div className="space-y-4 text-lg leading-relaxed text-ink/85">
          <h2 className="text-4xl text-ink">Who we are</h2>
          <p>
            {school.name} is a small, joyful creche, nursery and primary day school at {school.address}. We believe children learn best when they are busy with their hands, brave with their ideas and surrounded by grown-ups who cheer them on.
          </p>
          <p>
            Our classrooms are full of paint pots, building blocks, reading nooks and little gardens. Alongside the national curriculum, every child draws, makes, sings and plays every day.
          </p>
          <div className="lined relative wobbly border-2 border-ink py-4 pl-16 pr-5">
            <span className="tape" aria-hidden />
            <p className="font-display text-sm font-bold uppercase leading-8 tracking-widest text-sky">Our mission</p>
            <p className="font-scribble text-[1.9rem] leading-8 text-ink">{school.mission}</p>
          </div>
        </div>
        <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-5">
          <figure className="polaroid col-span-2 -rotate-2">
            <span className="tape" aria-hidden />
            <Scene id="school" className="block h-auto w-full" />
            <figcaption className="mt-2 text-center font-scribble text-2xl">Our little school</figcaption>
          </figure>
          <figure className="polaroid rotate-3">
            <Scene id="reading" className="block h-auto w-full" />
            <figcaption className="mt-2 text-center font-scribble text-xl">Reading corner</figcaption>
          </figure>
          <figure className="polaroid -rotate-1">
            <Scene id="music" className="block h-auto w-full" />
            <figcaption className="mt-2 text-center font-scribble text-xl">Music time</figcaption>
          </figure>
        </div>
      </section>

      <section className="border-y-2 border-dashed border-ink/20 bg-sky-soft/50 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-4xl sm:text-5xl">From first steps to Primary 6</h2>
          <Squiggle className="mx-auto mt-2 h-4 w-40" color={C.coral} />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {stages.map((s) => (
              <div key={s.name} className={`card border-[3px] ${s.color} text-center`}>
                <div className="text-5xl">{s.emoji}</div>
                <h3 className="mt-2 text-3xl">{s.name}</h3>
                <p className="font-scribble text-2xl text-ink/70">{s.ages}</p>
                <p className="mt-2 text-ink/80">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-4xl sm:text-5xl">Our values</h2>
        <p className="mt-1 text-center font-scribble text-2xl text-ink/70">stuck on every classroom door</p>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-7 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className={`sticky-note ${v.tilt} text-center`} style={{ background: v.bg }}>
              <span className="tape w-16 bg-white/55!" aria-hidden />
              <div className="text-5xl">{v.emoji}</div>
              <h3 className="mt-2 text-2xl">{v.title}</h3>
              <p className="text-sm text-ink/80 sm:text-base">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="card flex flex-col items-center gap-6 p-8 sm:flex-row sm:items-center">
          <LogoMark className="h-28 w-28 shrink-0 -rotate-6" />
          <div className="flex-1">
            <h2 className="text-3xl">Our motto</h2>
            <p className="mt-1 font-scribble text-4xl text-coral">&ldquo;{school.motto}&rdquo;</p>
            <p className="mt-3 text-ink/85">
              Every child arrives with a blank page and a box of crayons. Our job is to give them time, tools and encouragement, so the picture they draw of themselves is bold, bright and entirely their own.
            </p>
          </div>
          <Pip className="hidden h-32 w-auto sm:block" mood="wow" wave={false} />
        </div>
      </section>
    </>
  );
}
