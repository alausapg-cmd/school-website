import { PageHero } from "@/components/PageHero";
import { LogoMark, Nova, Planet } from "@/components/space/Art";
import { MissionScene } from "@/components/space/Scenes";
import { school } from "@/lib/school";

export const metadata = { title: "About us" };

const values = [
  { emoji: "🔭", title: "Curiosity", text: "We ask why, how and what if, then go and find out.", bg: "bg-sky-soft", fg: "text-sky" },
  { emoji: "🦁", title: "Courage", text: "We try new things and learn from every wobble.", bg: "bg-coral-soft", fg: "text-coral" },
  { emoji: "💛", title: "Kindness", text: "We look after our crewmates and our planet.", bg: "bg-sun-soft", fg: "text-ink" },
  { emoji: "🤝", title: "Teamwork", text: "Big missions need everyone pulling together.", bg: "bg-grass-soft", fg: "text-grass" },
];

const crew = [
  { stage: "Launch pad", ages: "Ages 1 to 3", text: "Creche and playgroup: songs, sensory play and first friendships.", color: "#45E3CC", shade: "#0B8A7E" },
  { stage: "Lift-off", ages: "Ages 3 to 5", text: "Nursery 1, Nursery 2 and Reception: phonics, counting and lots of curiosity.", color: "#FFD95A", shade: "#E0A100" },
  { stage: "Orbit", ages: "Ages 5 to 11", text: "Primary 1 to 6: strong literacy and numeracy, science, coding and the arts.", color: "#FF7A2F", shade: "#B8400F" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero emoji="🪐" kicker="About Novaridge" title="Meet our crew" text={school.tagline} color="bg-grape" />

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2">
        <div className="space-y-4 text-lg text-ink/80">
          <p className="kicker text-coral">Who we are</p>
          <h2 className="text-4xl font-extrabold text-ink">A small school with a big sky</h2>
          <p>
            {school.name} is a nursery and primary day school at {school.shortAddress}. Our classrooms are bright and busy, our classes are small, and our teachers know every child by name, and by favourite planet.
          </p>
          <p>
            We follow the national curriculum and enrich it with hands-on science, reading for pleasure, coding, music and plenty of outdoor play, so children grow in knowledge and in character.
          </p>
          <div className="rounded-[1.75rem] bg-sky-soft p-5">
            <p className="kicker text-sky">Our mission</p>
            <p className="mt-1 font-display text-2xl font-bold leading-snug text-ink">{school.mission}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MissionScene kind="observatory" className="col-span-2 aspect-[400/260] w-full rounded-[1.75rem]" title="Pupils at the rooftop observatory" />
          <MissionScene kind="art" className="aspect-[4/3] w-full rounded-[1.75rem]" title="Painting galaxies in the art studio" />
          <MissionScene kind="garden" className="aspect-[4/3] w-full rounded-[1.75rem]" title="Watering the star garden" />
        </div>
      </section>

      <section className="bg-sun-soft py-14">
        <div className="mx-auto max-w-6xl px-4">
          <p className="kicker text-center text-coral">Mission stages</p>
          <h2 className="mt-2 text-center text-4xl font-extrabold">From launch pad to orbit</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {crew.map((c, i) => (
              <div key={c.stage} className="card relative pt-10 text-center">
                <Planet color={c.color} shade={c.shade} ring={i === 2 ? "#3A3FBF" : undefined} className="absolute -top-10 left-1/2 h-20 w-20 -translate-x-1/2" />
                <span className="kicker text-ink/50">Stage {i + 1} · {c.ages}</span>
                <h3 className="mt-1 text-2xl font-extrabold">{c.stage}</h3>
                <p className="mt-1 text-ink/70">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-4xl font-extrabold">Our explorer values</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className={`rounded-[1.75rem] ${v.bg} p-6 text-center transition hover:-translate-y-1`}>
              <div className="text-5xl">{v.emoji}</div>
              <h3 className={`mt-2 text-2xl font-extrabold ${v.fg}`}>{v.title}</h3>
              <p className="text-ink/75">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-14">
        <div className="card flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <LogoMark className="h-28 w-28 shrink-0" />
          <div>
            <p className="kicker text-coral">Our motto</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-sky">&ldquo;{school.motto}&rdquo;</p>
            <p className="mt-3 text-ink/80">
              Every child arrives with questions. Our job is to keep those questions coming, give children the skills to find answers, and help them become kind, confident people who light up the world around them.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="night relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12">
          <div aria-hidden className="stars absolute inset-0 opacity-70" />
          <div className="relative grid items-center gap-8 md:grid-cols-[auto_1fr]">
            <Nova className="mx-auto h-48 w-auto animate-bob" title="Nova the rocket" />
            <div>
              <p className="kicker text-glow">Say hello to {school.mascot}</p>
              <h2 className="mt-1 text-4xl font-extrabold">Our mascot is a little rocket</h2>
              <p className="mt-3 text-lg text-white/85">
                Nova pops up all over school: on star charts, in the learning portal and on our sports day banners. Nova&apos;s rule is simple: <b className="text-star">try, wobble, try again, then fly!</b>
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  ["🔬", "Science lab"],
                  ["🔭", "Mini observatory"],
                  ["📚", "Reading nook"],
                  ["💻", "Coding club"],
                  ["⚽", "Sports field"],
                  ["🌱", "Star garden"],
                ].map(([e, t]) => (
                  <div key={t} className="flex items-center gap-2 rounded-2xl bg-white/8 px-3 py-2.5 ring-1 ring-white/15">
                    <span className="text-2xl">{e}</span>
                    <span className="font-display font-bold">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
