import Image from "next/image";
import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { NewsCard } from "@/components/NewsCard";
import { Wave } from "@/components/Wave";
import { getDB } from "@/lib/db";
import { today } from "@/lib/format";
import { school } from "@/lib/school";

const pillars = [
  { emoji: "✝️", title: "Godly character", text: "Daily devotion, Bible knowledge and values that shape how pupils live.", bg: "bg-sky-soft" },
  { emoji: "📚", title: "Sound academics", text: "Strong foundations from the early years right through to WAEC, NECO and BECE.", bg: "bg-sun-soft" },
  { emoji: "🦁", title: "Leadership", text: "Prefect roles, clubs and projects that grow confident, responsible leaders.", bg: "bg-grass-soft" },
  { emoji: "🤝", title: "Integrity", text: "Quality education without corruption: honest work and honest results.", bg: "bg-coral-soft" },
];

export default async function HomePage() {
  const db = await getDB();
  const news = [...db.news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const events = db.events.filter((e) => e.date >= today()).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);

  return (
    <>
      <section className="overflow-hidden bg-sky text-white">
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-10 pt-12 md:grid-cols-[1.1fr_1fr] md:pt-16">
          <div>
            <span className="chip mb-5 bg-sun text-ink">🎒 Admission in progress into all classes · {school.currentSession}</span>
            <h1 className="text-5xl font-bold leading-[1.05] sm:text-6xl">
              Building lives to the <span className="text-sun">glory of God</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/90">
              {school.name} is a Christian day and boarding school raising a generation of competent and godly leaders for Nigeria.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-sun text-lg">Apply for admission</Link>
              <Link href="/login" className="btn bg-white/15 text-lg text-white ring-2 ring-white/40 hover:bg-white/25">🎒 Learning Portal</Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {school.approvals.map((a) => (
                <span key={a} className="chip bg-white/15 text-sm text-white ring-1 ring-white/30">✓ {a}</span>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-full w-full rotate-[-3deg] rounded-[2rem] bg-sun" aria-hidden />
            <Image src="/images/building.jpg" alt="The Life Builders school building" width={664} height={336} priority className="relative w-full rounded-[2rem] object-cover shadow-xl ring-4 ring-white" />
            <div className="absolute -bottom-6 -right-2 hidden rotate-3 rounded-2xl bg-white p-1.5 shadow-xl sm:block">
              <Image src="/images/girls.jpg" alt="Life Builders pupils in uniform" width={416} height={310} className="h-32 w-auto rounded-xl" />
            </div>
          </div>
        </div>
        <Wave className="text-cream" />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-6 pt-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {school.highlights.map((h) => (
            <div key={h.label} className="card p-5 text-center">
              <div className="text-4xl">{h.value}</div>
              <div className="mt-1 font-display text-lg font-bold text-sky">{h.label}</div>
              <div className="text-sm text-ink/70">{h.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-coral">Our mission</p>
          <h2 className="mt-2 text-4xl font-bold">Raising competent and godly leaders for Nigeria</h2>
          <p className="mt-3 text-lg text-ink/70">Our motto is <b className="text-sky">{school.motto}</b>. Every child is taught to love God, work hard and lead with integrity.</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((r) => (
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
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-12 text-white sm:px-12">
          <div className="absolute -right-10 -top-10 text-[10rem] opacity-10" aria-hidden>🎒</div>
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-4xl font-bold">Our Learning Portal</h2>
              <p className="mt-3 text-lg opacity-90">
                Teachers share notes and assignments. Pupils take quizzes, hand in work, check their attendance and see their report cards, all in one place.
              </p>
              <Link href="/login" className="btn-sun mt-6">Log in to learn 🚀</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 text-ink">
              {[
                ["📒", "Notes"],
                ["✍️", "Assignments"],
                ["🧠", "Assessments"],
                ["🏆", "Results"],
              ].map(([e, t]) => (
                <div key={t} className="rounded-3xl bg-white p-5 text-center">
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
