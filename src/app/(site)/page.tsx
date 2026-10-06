import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { Fireflies, Fruit, Leaf, Vines } from "@/components/Jungle";
import { NewsCard } from "@/components/NewsCard";
import { Owl } from "@/components/Owl";
import { TreehouseScene } from "@/components/Treehouse";
import { Wave } from "@/components/Wave";
import { getDB } from "@/lib/db";
import { today } from "@/lib/format";
import { school } from "@/lib/school";

const day = [
  { time: "7:30", title: "Morning hello", emoji: "🌅", text: "High-fives at the gate and a wake-up song in the clearing." },
  { time: "8:00", title: "Big learning", emoji: "📚", text: "Maths and English while brains are fresh and bright." },
  { time: "10:30", title: "Fruit break", emoji: "🥭", text: "Mango slices, groundnuts and a run around the big tree." },
  { time: "11:00", title: "Explore time", emoji: "🔬", text: "Science, projects and nature trails around the garden." },
  { time: "1:00", title: "Lunch & story", emoji: "🍲", text: "A hot lunch, then a quiet story under the canopy." },
  { time: "2:00", title: "Clubs & creativity", emoji: "🥁", text: "Drumming, painting, coding, football and drama." },
  { time: "4:00", title: "Home or the nest", emoji: "🦉", text: "Day pupils head home; boarders settle into the cabins." },
];

const motto = [
  { word: "Grow", text: "Strong roots in reading, numbers and good values.", color: "text-grass", bg: "bg-grass-soft", icon: "🌱" },
  { word: "Explore", text: "Curious minds that ask why, how and what if.", color: "text-coral", bg: "bg-coral-soft", icon: "🧭" },
  { word: "Shine", text: "Confident, caring children ready for the world.", color: "text-wood", bg: "bg-sun-soft", icon: "✨" },
];

export default async function HomePage() {
  const db = await getDB();
  const news = [...db.news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const events = db.events.filter((e) => e.date >= today()).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);

  return (
    <>
      {/* HERO: the treehouse */}
      <section className="jungle-bg relative overflow-hidden">
        <Vines className="opacity-90" lengths={[60, 110, 40, 90, 70, 130, 50, 100]} />
        <Fireflies count={12} />
        <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 pb-4 pt-24 md:grid-cols-[1.05fr_1fr] md:pt-28">
          <div>
            <span className="chip mb-5 bg-sun px-4 py-1.5 text-sm text-ink shadow-[0_3px_0_#B87800]">🎒 Admissions open for {school.currentSession}</span>
            <h1 className="text-[2.7rem] font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">
              Where little <span className="text-sun">explorers</span> grow{" "}
              <span className="relative inline-block text-[#F7A8C8]">
                wise
                <svg viewBox="0 0 120 16" className="absolute -bottom-2 left-0 h-3 w-full" aria-hidden>
                  <path d="M2 10 C 30 2, 70 2, 118 8" stroke="#FFB320" strokeWidth="5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85">
              {school.name} is a leafy nursery, primary and secondary school in Ibadan, for day pupils and boarders. We climb high, learn deep and look after one another.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/apply" className="btn-sun text-lg">🌱 Apply for admission</Link>
              <Link href="/login" className="btn-wood text-lg">🎒 Learning Portal</Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {school.approvals.map((a) => (
                <span key={a} className="chip bg-white/10 text-sm text-white ring-1 ring-white/25">🍃 {a}</span>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[560px]">
            <TreehouseScene className="relative w-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)]" />
            <div className="absolute left-0 top-[44%] max-w-[10rem] -rotate-3 rounded-2xl bg-white px-3 py-2 text-sm font-bold text-ink shadow-lg sm:left-[-1rem] sm:max-w-[12rem]">
              <span className="hand block text-xl leading-tight text-grape">Hoo-hoo! Welcome, explorer!</span>
              <span className="text-xs font-semibold text-ink/60">Professor Hoot</span>
              <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 bg-white" aria-hidden />
            </div>
          </div>
        </div>
        <Wave className="text-cream" />
      </section>

      {/* FRUIT BADGES */}
      <section className="mx-auto max-w-6xl px-4 pb-6 pt-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {school.highlights.map((h, i) => (
            <div key={h.label} className={`card flex flex-col items-center p-5 text-center transition hover:-translate-y-1 ${i % 2 ? "md:translate-y-4" : ""}`}>
              <Fruit kind={h.fruit} className="h-20 w-20 text-4xl">{h.value}</Fruit>
              <div className="mt-2 font-display text-lg font-bold leading-tight text-sky">{h.label}</div>
              <div className="mt-1 text-sm text-ink/70">{h.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MOTTO */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="hand text-3xl text-coral">Our motto</p>
          <h2 className="mt-1 text-4xl font-extrabold sm:text-5xl">
            Grow <span className="text-sun">·</span> Explore <span className="text-sun">·</span> Shine
          </h2>
          <p className="mt-4 text-lg text-ink/75">{school.mission}</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {motto.map((m, i) => (
            <div key={m.word} className={`relative overflow-hidden rounded-[2rem] ${m.bg} p-7 ${i === 1 ? "md:-translate-y-3" : ""}`}>
              <Leaf className="absolute -right-4 -top-6 h-28 w-20 rotate-[35deg] opacity-25" />
              <div className="text-5xl">{m.icon}</div>
              <h3 className={`mt-3 text-4xl font-extrabold ${m.color}`}>{m.word}</h3>
              <p className="mt-1 text-ink/75">{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* A DAY AT OWLBERRY: branches timeline */}
      <section className="relative overflow-hidden bg-sky-soft py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <p className="hand text-3xl text-coral">Climb through the day</p>
            <h2 className="text-4xl font-extrabold sm:text-5xl">A day at Owlberry</h2>
          </div>
          <ol className="relative mt-12">
            {/* trunk */}
            <span className="wood absolute bottom-0 left-5 top-0 w-5 rounded-full md:left-1/2 md:-translate-x-1/2" aria-hidden />
            {day.map((d, i) => {
              const right = i % 2 === 1;
              return (
                <li key={d.time} className={`relative mb-8 pl-16 md:w-1/2 md:pl-0 ${right ? "md:ml-auto md:pl-14" : "md:pr-14"}`}>
                  {/* branch */}
                  <span
                    className={`wood absolute top-8 left-8 h-3 w-8 rounded-full md:w-14 ${right ? "md:left-0" : "md:left-auto md:right-0"}`}
                    aria-hidden
                  />
                  <span
                    className={`absolute top-3 left-1 grid h-12 w-12 place-items-center rounded-full bg-white text-2xl shadow-[0_4px_0_rgba(90,56,24,0.2)] ring-4 ring-grass ${right ? "md:-left-6" : "md:left-auto md:-right-6"}`}
                    aria-hidden
                  >
                    {d.emoji}
                  </span>
                  <div className={`card relative p-5 ${right ? "md:rotate-1" : "md:-rotate-1"}`}>
                    <span className="hand text-2xl leading-none text-coral">{d.time}</span>
                    <h3 className="text-2xl font-bold">{d.title}</h3>
                    <p className="text-ink/70">{d.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* NEWS */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="hand text-2xl text-coral">Fresh from the treehouse</p>
            <h2 className="text-4xl font-extrabold">Latest news</h2>
          </div>
          <Link href="/news" className="btn-ghost">All news →</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {news.map((n) => <NewsCard key={n.id} post={n} />)}
        </div>
      </section>

      {/* EVENTS */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="hand text-2xl text-coral">Mark your calendar</p>
            <h2 className="text-4xl font-extrabold">Coming up</h2>
          </div>
          <Link href="/events" className="btn-ghost">All events →</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {events.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      </section>

      {/* PORTAL */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="jungle-bg relative overflow-hidden rounded-[2.5rem] px-6 py-12 sm:px-12">
          <Fireflies count={8} />
          <div className="relative grid items-center gap-8 md:grid-cols-[auto_1fr_1fr]">
            <Owl book wave className="mx-auto h-44 w-40 md:h-56 md:w-52" />
            <div>
              <p className="hand text-3xl text-sun">Professor Hoot says…</p>
              <h2 className="text-4xl font-extrabold">Our Learning Portal</h2>
              <p className="mt-3 text-lg text-white/85">
                Notes, homework, quizzes, attendance, report cards and school fees, all in one cosy nest for pupils, parents and teachers.
              </p>
              <Link href="/login" className="btn-sun mt-6">Log in to learn 🚀</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 text-ink">
              {[
                ["📒", "Notes", "mango"],
                ["✍️", "Homework", "berry"],
                ["🧠", "Quizzes", "lime"],
                ["🏆", "Report cards", "plum"],
              ].map(([e, t, f], i) => (
                <div key={t} className={`rounded-3xl bg-cream p-4 text-center ${i % 2 ? "rotate-2" : "-rotate-2"}`}>
                  <Fruit kind={f} className="mx-auto h-14 w-14 text-2xl">{e}</Fruit>
                  <div className="mt-1 font-display font-bold">{t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
