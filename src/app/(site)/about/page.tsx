import { Fruit, HangingSign, Leaf } from "@/components/Jungle";
import { Owl } from "@/components/Owl";
import { PageHero } from "@/components/PageHero";
import { GardenScene, LibraryScene, NightScene } from "@/components/Scenes";
import { school } from "@/lib/school";

export const metadata = { title: "About us" };

const values = [
  { emoji: "🌱", title: "Curiosity", text: "We ask questions and go looking for answers.", fruit: "lime" },
  { emoji: "🤝", title: "Kindness", text: "We look after each other, big and small.", fruit: "berry" },
  { emoji: "⭐", title: "Excellence", text: "We give our best in every lesson and game.", fruit: "mango" },
  { emoji: "🦉", title: "Wisdom", text: "We think carefully and choose what is right.", fruit: "plum" },
];

const badges = [
  ["🏡", "Day and boarding", "bg-sun-soft"],
  ["🌅", "Morning circle", "bg-coral-soft"],
  ["📖", "Nursery to Secondary", "bg-sky-soft"],
  ["⚽", "Sports and inter-house games", "bg-grass-soft"],
  ["🎨", "Clubs and creative arts", "bg-grape-soft"],
  ["🛝", "Adventure playground", "bg-sun-soft"],
];

export default function AboutPage() {
  return (
    <>
      <PageHero emoji="🦉" title="About Owlberry" kicker="Hello, explorer!" text={school.tagline} fruit="plum" />

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2">
        <div className="space-y-4 text-lg text-ink/80">
          <p className="hand text-3xl text-coral">Who we are</p>
          <h2 className="text-4xl font-extrabold text-ink">A school that grows like a tree</h2>
          <p>
            {school.name} is a nursery, primary and secondary school on Orchard Avenue in Bodija, Ibadan, welcoming both day pupils and boarders.
          </p>
          <p>
            Our classrooms open onto gardens and shady trees. Children learn by doing: planting, building, measuring, reading, singing and asking a great many questions.
          </p>
          <div className="relative overflow-hidden rounded-3xl bg-sky p-6 text-white">
            <Leaf className="absolute -right-3 -top-5 h-24 w-16 rotate-45 opacity-40" color="#7CC24A" />
            <p className="hand text-2xl text-sun">Our mission</p>
            <p className="mt-1 font-display text-2xl font-bold leading-snug">{school.mission}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 overflow-hidden rounded-3xl ring-4 ring-white shadow-[0_8px_0_rgba(90,56,24,0.12)]"><LibraryScene /></div>
          <div className="-rotate-2 overflow-hidden rounded-3xl ring-4 ring-white shadow-[0_8px_0_rgba(90,56,24,0.12)]"><GardenScene /></div>
          <div className="rotate-2 overflow-hidden rounded-3xl ring-4 ring-white shadow-[0_8px_0_rgba(90,56,24,0.12)]"><NightScene /></div>
        </div>
      </section>

      <section className="bg-sun-soft py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <HangingSign><h2 className="text-3xl font-extrabold sm:text-4xl">Our values</h2></HangingSign>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="card flex flex-col items-center text-center">
                <Fruit kind={v.fruit} className="h-20 w-20 text-4xl">{v.emoji}</Fruit>
                <h3 className="mt-2 text-2xl font-bold">{v.title}</h3>
                <p className="text-ink/70">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14">
        <div className="card flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <Owl wave className="h-40 w-36 shrink-0" />
          <div>
            <p className="hand text-2xl text-coral">Meet our mascot</p>
            <h2 className="text-3xl font-extrabold">{school.mascot}</h2>
            <p className="mt-2 font-display text-2xl text-sky">&ldquo;{school.motto}&rdquo;</p>
            <p className="mt-3 text-ink/80">
              Professor Hoot lives in the big tree by the library. He loves riddles, books and berries, and he reminds every Owlberry explorer that being wise means being curious, kind and brave enough to try again.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="text-center">
          <p className="hand text-3xl text-coral">Explorer badges</p>
          <h2 className="text-4xl font-extrabold">School life</h2>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {badges.map(([e, t, bg], i) => (
            <div key={t} className={`flex items-center gap-3 rounded-[2rem] border-4 border-dashed border-wood/25 ${bg} p-4 sm:gap-4 sm:p-5`}>
              <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-3xl shadow-[0_4px_0_rgba(90,56,24,0.15)] ${i % 2 ? "rotate-6" : "-rotate-6"}`}>{e}</span>
              <span className="font-display text-base font-bold leading-tight sm:text-lg">{t}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
