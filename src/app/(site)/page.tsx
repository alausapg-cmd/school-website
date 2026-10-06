import Link from "next/link";
import type { CSSProperties } from "react";
import { C, HeroScene, PipSays, Scene, Scribble, Squiggle, type SceneId } from "@/components/Doodles";
import { EventCard } from "@/components/EventCard";
import { NewsCard } from "@/components/NewsCard";
import { getDB } from "@/lib/db";
import { today } from "@/lib/format";
import { school } from "@/lib/school";

const NOTES = [
  { bg: "#FFE98A", tilt: "-rotate-2" },
  { bg: "#BFDBFF", tilt: "rotate-2" },
  { bg: "#BDEBC9", tilt: "-rotate-1" },
  { bg: "#FFC9C2", tilt: "rotate-1" },
];

const MOTTO = [
  { word: "Imagine", color: C.sky, border: "border-sky", emoji: "💭", text: "Big questions, story building and pretend play grow curious, creative thinkers.", tilt: "-rotate-1" },
  { word: "Create", color: C.coral, border: "border-coral", emoji: "🖍️", text: "Every day pupils draw, build, cook, sing and make, because hands help heads learn.", tilt: "rotate-1" },
  { word: "Achieve", color: C.grass, border: "border-grass", emoji: "🏆", text: "Strong reading, writing and maths, with small steps celebrated all the way.", tilt: "-rotate-[0.6deg]" },
];

const DAY = [
  { time: "7:30", what: "Hello circle", emoji: "👋", bg: "bg-sun-soft" },
  { time: "8:00", what: "Phonics & numbers", emoji: "🔤", bg: "bg-sky-soft" },
  { time: "10:00", what: "Snack & play", emoji: "🍎", bg: "bg-grass-soft" },
  { time: "10:30", what: "Make & discover", emoji: "🔬", bg: "bg-grape-soft" },
  { time: "12:00", what: "Lunch together", emoji: "🍲", bg: "bg-coral-soft" },
  { time: "1:00", what: "Story time", emoji: "📚", bg: "bg-sun-soft" },
  { time: "2:30", what: "Home time", emoji: "🏡", bg: "bg-sky-soft" },
];

const POLAROIDS: { id: SceneId; caption: string; tilt: string }[] = [
  { id: "art", caption: "Art day rainbows", tilt: "-rotate-3" },
  { id: "science", caption: "Volcano fizz!", tilt: "rotate-2" },
  { id: "garden", caption: "Our sunflowers", tilt: "-rotate-1" },
];

export default async function HomePage() {
  const db = await getDB();
  const news = [...db.news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const events = db.events.filter((e) => e.date >= today()).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);

  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-14 pt-8 md:grid-cols-[1fr_1.05fr] md:pt-14">
          <div className="relative">
            <span className="relative inline-block -rotate-2 bg-[#FFE98A] px-4 py-2 font-display text-base font-bold shadow-[0_8px_12px_-8px_rgb(42_43_51/0.5)]">
              <span className="tape -top-3 w-16" aria-hidden />
              🎒 Admissions open for {school.currentSession}
            </span>
            <h1 className="mt-6 text-[2.7rem] leading-[1.05] sm:text-6xl">
              Every child is a
              <span className="relative mt-1 block w-fit font-scribble text-[4.6rem] leading-[0.95] text-coral sm:text-[6.5rem]">
                masterpiece
                <Scribble color={C.sun} className="absolute -bottom-3 left-0 h-5 w-full" />
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">
              {school.name} is a creche, nursery and primary day school in Wuse 2, Abuja, where little ones learn to read, count, wonder and make things, one happy page at a time.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/apply" className="btn-sun text-lg">✍️ Apply for admission</Link>
              <Link href="/contact" className="btn-ghost text-lg">Book a visit</Link>
            </div>
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-lg font-bold">
              <span className="text-sky">Imagine</span>
              <span className="text-ink/40" aria-hidden>✶</span>
              <span className="text-coral">Create</span>
              <span className="text-ink/40" aria-hidden>✶</span>
              <span className="text-grass">Achieve</span>
            </p>
          </div>
          <div className="relative">
            <div className="relative wobbly-lg border-2 border-ink bg-paper p-2 shadow-[6px_7px_0_rgb(42_43_51/0.18)] sm:rotate-1 sm:p-3">
              <span className="tape -left-4 top-3 rotate-[-38deg] translate-x-0" aria-hidden />
              <span className="tape -right-14 left-auto top-4 rotate-[36deg] translate-x-0 bg-[#9CC7FF]!" aria-hidden />
              <HeroScene className="h-auto w-full" />
            </div>
            <p className="mt-3 text-center font-scribble text-2xl text-ink/70 sm:-rotate-1">↑ drawn by Primary 4 Crayon (with a little help from Pip)</p>
          </div>
        </div>
      </section>

      {/* ---------- sticky-note highlights ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4 md:gap-6">
          {school.highlights.map((h, i) => (
            <div key={h.label} className={`sticky-note ${NOTES[i].tilt} transition hover:rotate-0 hover:scale-[1.03]`} style={{ background: NOTES[i].bg }}>
              <span className="tape w-16 bg-white/55!" aria-hidden />
              <div className="text-4xl">{h.value}</div>
              <div className="mt-1 font-display text-xl font-bold leading-tight">{h.label}</div>
              <div className="mt-1 text-sm leading-snug text-ink/80">{h.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- motto ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-scribble text-3xl text-coral">Our motto</p>
          <h2 className="mt-1 text-4xl sm:text-5xl">Imagine, Create, Achieve</h2>
          <Squiggle className="mx-auto mt-2 h-4 w-40" color={C.grape} />
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {MOTTO.map((m, i) => (
            <div key={m.word} className={`relative wobbly-lg border-[3px] ${m.border} bg-paper p-6 pt-8 shadow-[5px_6px_0_rgb(42_43_51/0.12)] ${m.tilt}`}>
              <span className="absolute -top-5 left-5 grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-white font-display text-xl font-bold" aria-hidden>
                {i + 1}
              </span>
              <div className="flex items-center justify-between">
                <h3 className="font-scribble text-6xl leading-none" style={{ color: m.color }}>{m.word}</h3>
                <span className="text-5xl" aria-hidden>{m.emoji}</span>
              </div>
              <p className="mt-3 text-ink/80">{m.text}</p>
            </div>
          ))}
        </div>
        <figure className="lined relative mx-auto mt-12 max-w-3xl wobbly border-2 border-ink py-6 pl-16 pr-6 shadow-[5px_6px_0_rgb(42_43_51/0.12)] sm:pl-20">
          <span className="tape" aria-hidden />
          <blockquote className="font-scribble text-[2rem] leading-[2rem] text-ink sm:text-[2.2rem]">
            &ldquo;{school.mission}&rdquo;
          </blockquote>
          <figcaption className="mt-2 font-display font-bold leading-8 text-sky">Our mission</figcaption>
        </figure>
      </section>

      {/* ---------- a day at Doodlebrook ---------- */}
      <section className="border-y-2 border-dashed border-ink/20 bg-sun-soft/50 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <p className="font-scribble text-3xl text-sky">Follow the dotted line</p>
            <h2 className="text-4xl sm:text-5xl">A day at Doodlebrook</h2>
          </div>
          <ol className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-7 lg:gap-3">
            <svg className="absolute left-0 top-12 hidden h-8 w-full lg:block" viewBox="0 0 1000 30" preserveAspectRatio="none" aria-hidden>
              <path d="M20 15 Q90 0 160 15 T300 15 T440 15 T580 15 T720 15 T860 15 T990 15" fill="none" stroke={C.ink} strokeWidth="2.5" strokeDasharray="7 9" opacity="0.45" />
            </svg>
            {DAY.map((d, i) => (
              <li key={d.time} className={`relative flex items-center gap-4 wobbly border-2 border-ink ${d.bg} p-3 lg:flex-col lg:gap-1 lg:p-4 lg:text-center ${i % 2 ? "lg:translate-y-4" : ""}`}>
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-ink bg-white text-3xl">{d.emoji}</span>
                <span>
                  <span className="block font-scribble text-3xl leading-none text-ink/70">{d.time}</span>
                  <span className="block font-display text-lg font-bold leading-tight">{d.what}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- polaroids ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-scribble text-3xl text-grass">Pinned to the classroom wall</p>
            <h2 className="text-4xl sm:text-5xl">Our sketchbook</h2>
          </div>
          <Link href="/gallery" className="btn-ghost">See the whole gallery →</Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {POLAROIDS.map((p) => (
            <figure key={p.id} className={`polaroid relative ${p.tilt} transition hover:rotate-0 hover:scale-[1.02]`}>
              <span className="tape" aria-hidden />
              <Scene id={p.id} className="block h-auto w-full" />
              <figcaption className="mt-3 text-center font-scribble text-3xl leading-none">{p.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- news & events ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-end justify-between gap-3">
          <h2 className="text-4xl sm:text-5xl">Fresh off the press <span aria-hidden>📰</span></h2>
          <Link href="/news" className="shrink-0 font-display text-lg font-bold text-sky">All news →</Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {news.map((n, i) => <NewsCard key={n.id} post={n} i={i} />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between gap-3">
          <h2 className="text-4xl sm:text-5xl">Coming up <span aria-hidden>🗓️</span></h2>
          <Link href="/events" className="shrink-0 font-display text-lg font-bold text-sky">All events →</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {events.map((e, i) => <EventCard key={e.id} event={e} i={i} />)}
        </div>
      </section>

      {/* ---------- portal ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="relative overflow-hidden wobbly-lg border-2 border-ink bg-ink px-6 py-12 text-white sm:px-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" } as CSSProperties}
            aria-hidden
          />
          <div className="relative grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="font-scribble text-3xl text-sun">For pupils, parents and teachers</p>
              <h2 className="text-4xl sm:text-5xl">The Learning Portal</h2>
              <p className="mt-3 text-lg text-white/85">
                Teachers share notes and homework. Pupils take quizzes and collect stars. Parents check attendance, report cards and fees, all in one sketchbook.
              </p>
              <Link href="/login" className="btn-sun mt-6 text-lg">Open the portal ✏️</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 text-ink">
              {[
                ["📒", "Notes", "#FFE98A", "-rotate-2"],
                ["✍️", "Homework", "#BFDBFF", "rotate-2"],
                ["🧠", "Quizzes", "#BDEBC9", "rotate-1"],
                ["🏆", "Report cards", "#FFC9C2", "-rotate-1"],
              ].map(([e, t, bg, tilt]) => (
                <div key={t} className={`sticky-note text-center ${tilt}`} style={{ background: bg }}>
                  <div className="text-4xl">{e}</div>
                  <div className="font-display text-lg font-bold">{t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- visit ---------- */}
      <section className="mx-auto max-w-4xl px-4 pb-16 pt-6">
        <PipSays className="justify-center">
          Come and say hello! We&apos;re at <b>{school.address}</b>. Call <b>{school.phones[0]}</b> to book a tour.
        </PipSays>
      </section>
    </>
  );
}
