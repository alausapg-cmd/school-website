import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { school } from "@/lib/school";

export const metadata = { title: "About us" };

const values = [
  { emoji: "✝️", title: "Godliness", text: "We honour God in our words, work and play." },
  { emoji: "⭐", title: "Excellence", text: "We give our best in every subject and activity." },
  { emoji: "⚖️", title: "Integrity", text: "Quality education without corruption, always." },
  { emoji: "🦁", title: "Leadership", text: "We serve others and lead by good example." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero emoji="🏫" title="About our school" text={school.tagline} />

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2">
        <div className="space-y-4 text-lg text-ink/80">
          <h2 className="text-4xl font-bold text-ink">Who we are</h2>
          <p>
            {school.name} is a Christian day and boarding school on Igbusi Road, Iyana Ilogbo, along the Lagos to Abeokuta Expressway in Ogun State.
          </p>
          <p>
            We are approved by the government and are a recognised centre for WAEC, NECO and BECE examinations. Our pupils grow in knowledge and in character, in a safe and caring environment.
          </p>
          <div className="rounded-3xl bg-sky-soft p-5">
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-sky">Our mission</p>
            <p className="mt-1 font-display text-2xl font-semibold text-ink">{school.mission}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Image src="/images/building.jpg" alt="Our school building" width={664} height={336} className="col-span-2 w-full rounded-3xl object-cover" />
          <Image src="/images/pupils.jpg" alt="Pupils at assembly" width={226} height={258} className="h-48 w-full rounded-3xl object-cover" />
          <Image src="/images/play.jpg" alt="Pupils at the playground" width={188} height={258} className="h-48 w-full rounded-3xl object-cover" />
        </div>
      </section>

      <section className="bg-sun-soft py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-4xl font-bold">Our values</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="card text-center">
                <div className="text-5xl">{v.emoji}</div>
                <h3 className="mt-2 text-2xl font-semibold">{v.title}</h3>
                <p className="text-ink/70">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14">
        <div className="card flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <Image src={school.logo} alt="" width={112} height={112} className="h-28 w-28 shrink-0 rounded-full ring-4 ring-sun" />
          <div>
            <h2 className="text-3xl font-bold">Our motto</h2>
            <p className="mt-2 font-display text-2xl text-sky">&ldquo;{school.motto}&rdquo;</p>
            <p className="mt-3 text-ink/80">
              We believe every child is a gift from God with a purpose to fulfil. Our teachers combine sound teaching with Christian values, so that our pupils leave us as competent, honest and godly leaders, ready to build their nation.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-center text-4xl font-bold">School life</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            ["🏠", "Day and boarding"],
            ["🙏", "Morning devotion"],
            ["📖", "Classrooms for every level"],
            ["⚽", "Sports and inter-house games"],
            ["🎨", "Clubs and creative arts"],
            ["🛝", "Children's playground"],
          ].map(([e, t]) => (
            <div key={t} className="card flex items-center gap-4">
              <span className="text-4xl">{e}</span>
              <span className="font-display text-lg font-semibold">{t}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
