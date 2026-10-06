import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { NewsCard } from "@/components/NewsCard";
import { Wave } from "@/components/Wave";
import { getDB } from "@/lib/db";
import { today } from "@/lib/format";
import { school } from "@/lib/school";

const reasons = [
  { emoji: "🧪", title: "Learn by doing", text: "Experiments, projects and play make every lesson stick.", bg: "bg-grass-soft" },
  { emoji: "📚", title: "Love of reading", text: "Cosy reading corners in every class and a library full of adventures.", bg: "bg-sky-soft" },
  { emoji: "🎨", title: "Creative minds", text: "Art, music, drama and coding clubs for every kind of talent.", bg: "bg-grape-soft" },
  { emoji: "💻", title: "Learning online too", text: "Notes, homework and fun quizzes waiting in our Learning Portal.", bg: "bg-sun-soft" },
];

export default async function HomePage() {
  const db = await getDB();
  const news = [...db.news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const events = db.events.filter((e) => e.date >= today()).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);

  return (
    <>
      <section className="overflow-hidden">
        <div className="relative">
        <div className="pointer-events-none absolute inset-0 select-none text-5xl sm:text-6xl" aria-hidden>
          <span className="absolute left-[6%] top-10 animate-float">⭐</span>
          <span className="absolute right-[8%] top-16 animate-float [animation-delay:1s]">🎈</span>
          <span className="absolute bottom-24 left-[12%] hidden animate-float [animation-delay:2s] sm:block">✏️</span>
          <span className="absolute bottom-16 right-[14%] hidden animate-float [animation-delay:3s] sm:block">🚀</span>
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 text-center sm:pt-20">
          <span className="chip mb-5 bg-sun-soft text-ink">🌞 Admissions open for {school.currentSession}</span>
          <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-[1.05] sm:text-7xl">
            Where little minds grow{" "}
            <span className="relative inline-block text-sky">
              big dreams
              <svg viewBox="0 0 200 12" className="absolute -bottom-2 left-0 w-full text-sun" aria-hidden>
                <path d="M2 8 Q50 2 100 7 T198 6" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-ink/70">
            {school.name} is a happy, caring primary school where children explore, create and learn every day, in class and online.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/about" className="btn-primary text-lg">Discover our school</Link>
            <Link href="/login" className="btn-sun text-lg">🎒 Go to Learning Portal</Link>
          </div>
        </div>
        </div>
        <div className="bg-sky text-white">
          <Wave flip className="-mt-px text-cream" />
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4">
            {school.stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl">{s.emoji}</div>
                <div className="font-display text-4xl font-bold">{s.value}</div>
                <div className="text-sm font-semibold opacity-90">{s.label}</div>
              </div>
            ))}
          </div>
          <Wave className="text-cream" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-4xl font-bold">Why children love {school.shortName} 💛</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r) => (
            <div key={r.title} className={`rounded-3xl ${r.bg} p-6 transition hover:-translate-y-1`}>
              <div className="text-5xl">{r.emoji}</div>
              <h3 className="mt-3 text-xl font-semibold">{r.title}</h3>
              <p className="mt-1 text-ink/70">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-4xl font-bold">Latest news 📰</h2>
          <Link href="/news" className="font-display font-semibold text-sky">All news →</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {news.map((n) => <NewsCard key={n.id} post={n} />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-4xl font-bold">Coming up 🗓️</h2>
          <Link href="/events" className="font-display font-semibold text-sky">All events →</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {events.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-grape px-6 py-12 text-white sm:px-12">
          <div className="absolute -right-10 -top-10 text-[10rem] opacity-20" aria-hidden>🎒</div>
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-4xl font-bold">Our Learning Portal</h2>
              <p className="mt-3 text-lg opacity-90">
                Teachers share notes and homework. Pupils take fun quizzes, hand in assignments, check their attendance and see their report cards, all in one place.
              </p>
              <Link href="/login" className="btn-sun mt-6">Log in to learn 🚀</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 text-ink">
              {[
                ["📒", "Notes"],
                ["✍️", "Assignments"],
                ["🧠", "Quizzes"],
                ["🏆", "Results"],
              ].map(([e, t]) => (
                <div key={t} className="rounded-3xl bg-white/95 p-5 text-center">
                  <div className="text-4xl">{e}</div>
                  <div className="font-display font-semibold">{t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
