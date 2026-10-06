import { PageHero } from "@/components/PageHero";
import { school } from "@/lib/school";

export const metadata = { title: "About us" };

const values = [
  { emoji: "💛", title: "Kindness", text: "We look after each other and our world." },
  { emoji: "🔍", title: "Curiosity", text: "We ask questions and love finding answers." },
  { emoji: "🦁", title: "Courage", text: "We try new things and learn from mistakes." },
  { emoji: "🤝", title: "Teamwork", text: "We achieve more when we work together." },
];

const facilities = [
  ["📚", "Library & reading corners"],
  ["🔬", "Science lab"],
  ["💻", "Computer room"],
  ["⚽", "Sports field"],
  ["🎵", "Music room"],
  ["🌳", "School garden"],
];

export default function AboutPage() {
  return (
    <>
      <PageHero emoji="🏫" title="About our school" text={`Since ${school.founded}, ${school.name} has helped children grow into confident, caring learners.`} />

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2">
        <div className="space-y-4 text-lg text-ink/80">
          <h2 className="text-4xl font-bold text-ink">Our story</h2>
          <p>
            {school.name} began in {school.founded} with just 24 pupils and one big idea: school should be a place children run towards every morning.
          </p>
          <p>
            Today we are a family of over 480 pupils from Creche to Primary 6. We blend the Nigerian curriculum with hands-on projects, creative arts and digital skills so every child can shine in their own way.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-5xl">
          {["🌞", "📐", "🎨", "🧩", "🌍", "🎭", "🚀", "🎵", "🌱"].map((e, i) => (
            <div key={i} className={`grid aspect-square place-items-center rounded-3xl ${["bg-sun-soft", "bg-sky-soft", "bg-grass-soft", "bg-coral-soft", "bg-grape-soft"][i % 5]}`}>
              {e}
            </div>
          ))}
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
          <div className="grid h-28 w-28 shrink-0 place-items-center rounded-full bg-grape-soft text-6xl">👩🏾‍🏫</div>
          <div>
            <h2 className="text-3xl font-bold">A welcome from our Head Teacher</h2>
            <p className="mt-3 text-ink/80">
              &ldquo;Every child who walks through our gates is unique. Our job is to help them discover what makes them special, and to make learning an adventure they will remember for life. Welcome to the {school.shortName} family!&rdquo;
            </p>
            <p className="mt-3 font-display font-semibold">Mrs Funmi Adeyemi, Head Teacher</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-center text-4xl font-bold">Our facilities</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {facilities.map(([e, t]) => (
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
