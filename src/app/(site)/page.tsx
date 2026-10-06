import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { NewsCard } from "@/components/NewsCard";
import { LogoMark, Nova, Planet, Sparkle, Starfield } from "@/components/space/Art";
import { MissionScene } from "@/components/space/Scenes";
import { Wave } from "@/components/Wave";
import { getDB } from "@/lib/db";
import { today } from "@/lib/format";
import { school } from "@/lib/school";

const pillars = [
  { emoji: "🔭", title: "Curiosity first", text: "Hands-on science, a school garden and a rooftop mini observatory for real stargazing.", bg: "bg-glow", ring: 19, dur: 22, delay: 3 },
  { emoji: "📚", title: "Strong foundations", text: "Reading, writing and number skills built step by step in small crews of 20 or fewer.", bg: "bg-sun", ring: 27, dur: 34, delay: 20 },
  { emoji: "💛", title: "Kind and brave", text: "Kindness, courage and teamwork are celebrated as loudly as test scores.", bg: "bg-rocket", ring: 35, dur: 46, delay: 8 },
  { emoji: "🎨", title: "Create and play", text: "Art, music, coding club and sports keep every explorer's week bright.", bg: "bg-lilac", ring: 42, dur: 58, delay: 40 },
];

const day = [
  { time: "7:30", emoji: "🌅", title: "Arrival & breakfast club" },
  { time: "8:00", emoji: "🧭", title: "Mission briefing circle" },
  { time: "8:30", emoji: "🔢", title: "Maths & English" },
  { time: "10:30", emoji: "⚽", title: "Break & play" },
  { time: "11:00", emoji: "🔬", title: "Science & discovery" },
  { time: "12:30", emoji: "🍲", title: "Lunch together" },
  { time: "1:15", emoji: "🎨", title: "Arts, music or coding" },
  { time: "2:30", emoji: "🏠", title: "Home time or extended day" },
];
const dayPoints = day.map((_, i) => ({ x: 6 + i * (88 / (day.length - 1)), y: i % 2 ? 62 : 20 }));

export default async function HomePage() {
  const db = await getDB();
  const news = [...db.news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const events = db.events.filter((e) => e.date >= today()).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);

  return (
    <>
      {/* Hero: night sky, planet, and Nova on the launch pad. */}
      <section className="night relative overflow-hidden">
        <Starfield shooting />
        <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 pb-4 pt-10 md:grid-cols-[1.15fr_1fr] md:pt-16">
          <div className="relative z-10">
            <span className="chip mb-5 bg-white/10 py-1.5 text-sm text-star ring-1 ring-star/40">
              <span className="font-mono">T-MINUS</span> · Admissions open for {school.currentSession}
            </span>
            <h1 className="text-[2.75rem] font-extrabold leading-[1] sm:text-6xl lg:text-7xl">
              Reach for the{" "}
              <span className="relative inline-block text-star">
                stars
                <Sparkle className="absolute -right-6 -top-3 h-6 w-6 animate-twinkle" />
              </span>
              , <span className="text-glow">one lesson</span> at a time
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">
              {school.name} is a nursery and primary day school in Lekki where young explorers ask big questions, try bold ideas and grow kind, curious hearts.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/apply" className="btn-sun text-lg">Join the crew ✦</Link>
              <Link href="/login" className="btn-space text-lg">🚀 Learning Portal</Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {school.approvals.map((a) => (
                <span key={a} className="chip bg-white/8 text-sm text-white/85 ring-1 ring-white/25">✓ {a}</span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto h-[360px] w-full max-w-[440px] sm:h-[440px]">
            <div aria-hidden className="absolute inset-[6%] rounded-full border-2 border-dashed border-white/15" />
            <div aria-hidden className="absolute inset-[18%] rounded-full border border-white/10" />
            <Planet color="#FF7A2F" shade="#B8400F" ring="#45E3CC" className="absolute -right-10 bottom-0 h-44 w-44 sm:-right-14 sm:h-64 sm:w-64" />
            <div aria-hidden className="absolute inset-0 animate-orbit [animation-duration:24s]">
              <Planet color="#C8B6FF" shade="#7A4FD6" bands={false} className="absolute left-[4%] top-[8%] h-14 w-14" />
            </div>
            <Planet color="#FFD95A" shade="#E0A100" className="absolute left-0 top-[52%] h-16 w-16 animate-drift" />
            <Sparkle className="absolute right-[18%] top-[6%] h-5 w-5 animate-twinkle" color="#fff" />
            <Sparkle className="absolute left-[30%] top-[30%] h-3 w-3 animate-twinkle [animation-delay:1s]" color="#45E3CC" />

            <button type="button" className="group absolute bottom-[6%] left-[16%] flex flex-col items-center outline-none sm:left-[22%]" aria-label="Hover or tap to launch Nova the rocket">
              <span className="block transition-transform duration-[1400ms] ease-in group-hover:-translate-y-[520px] group-focus:-translate-y-[520px]">
                <Nova className="h-44 w-auto animate-bob group-hover:animate-none sm:h-52" title="Nova, the Novaridge rocket" />
              </span>
              <span aria-hidden className="pointer-events-none absolute bottom-6 h-10 w-36 rounded-full bg-white/0 blur-md transition duration-700 group-hover:bg-white/40" />
              <span className="-mt-3 h-3 w-28 rounded-full bg-white/20" />
              <span className="kicker mt-2 text-[0.6rem] text-white/60 transition group-hover:text-star">Hover or tap to launch Nova</span>
            </button>
          </div>
        </div>
        <Wave className="relative text-cream" />
      </section>

      {/* Mission stats */}
      <section className="relative z-10 mx-auto -mt-4 max-w-6xl px-4 pb-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {school.highlights.map((h, i) => (
            <div key={h.label} className="card relative overflow-hidden p-5 text-center">
              <span aria-hidden className={`absolute inset-x-0 top-0 h-1.5 ${["bg-sky", "bg-rocket", "bg-grass", "bg-grape"][i % 4]}`} />
              <div className="text-4xl">{h.value}</div>
              <div className="mt-1 font-display text-lg font-extrabold leading-tight text-sky">{h.label}</div>
              <div className="mt-1 text-sm text-ink/70">{h.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us: an orbiting solar system */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="kicker text-coral">Our mission</p>
          <h2 className="mt-2 text-4xl font-extrabold sm:text-5xl">Why families orbit Novaridge</h2>
          <p className="mt-3 text-lg text-ink/70">{school.mission} Our motto says it all: <b className="text-sky">{school.motto}</b>.</p>
        </div>
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          <div className="night relative mx-auto aspect-square w-full max-w-[460px] overflow-hidden rounded-full shadow-[0_0_0_10px_#E7E8FC]">
            <Starfield />
            {pillars.map((p) => (
              <div key={p.title} aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/20" style={{ width: `${p.ring * 2}%`, height: `${p.ring * 2}%` }} />
            ))}
            <div className="absolute left-1/2 top-1/2 grid h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-star shadow-[0_0_40px_10px_rgba(255,217,90,0.45)]">
              <LogoMark className="h-[78%] w-[78%]" />
            </div>
            {pillars.map((p) => (
              <div key={p.title} className="absolute inset-0 animate-orbit" style={{ animationDuration: `${p.dur}s`, animationDelay: `-${p.delay}s` }}>
                <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${50 + p.ring}%`, top: "50%" }}>
                  <div className="animate-orbit-rev" style={{ animationDuration: `${p.dur}s`, animationDelay: `-${p.delay}s` }}>
                    <span className={`grid h-12 w-12 place-items-center rounded-full ${p.bg} text-2xl shadow-[inset_-6px_-5px_0_rgba(0,0,0,0.18)] sm:h-14 sm:w-14 sm:text-3xl`} title={p.title}>{p.emoji}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {pillars.map((p, i) => (
              <div key={p.title} className="card relative transition hover:-translate-y-1">
                <span className={`grid h-14 w-14 place-items-center rounded-full ${p.bg} text-3xl shadow-[inset_-6px_-5px_0_rgba(0,0,0,0.15)]`}>{p.emoji}</span>
                <span className="kicker absolute right-5 top-6 text-ink/35">Orbit {i + 1}</span>
                <h3 className="mt-3 text-xl font-extrabold">{p.title}</h3>
                <p className="mt-1 text-ink/70">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A day at Novaridge: a constellation timeline */}
      <section className="relative">
        <Wave className="text-night" />
        <div className="night relative overflow-hidden py-14">
          <Starfield />
          <div className="relative mx-auto max-w-6xl px-4">
            <div className="text-center">
              <p className="kicker text-glow">Flight plan</p>
              <h2 className="mt-2 text-4xl font-extrabold sm:text-5xl">A day at Novaridge</h2>
              <p className="mx-auto mt-3 max-w-xl text-white/80">Join the dots: every day is a constellation of learning, play and friendship.</p>
            </div>

            <ol className="relative mt-10 space-y-5 border-l-2 border-dashed border-lilac/40 pl-8 md:hidden">
              {day.map((d) => (
                <li key={d.time} className="relative">
                  <Sparkle className="absolute -left-[2.85rem] top-1 h-7 w-7" />
                  <span className="kicker text-star">{d.time}</span>
                  <p className="font-display text-lg font-bold">{d.emoji} {d.title}</p>
                </li>
              ))}
            </ol>

            <div className="relative mt-8 hidden h-[24rem] md:block">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
                <polyline
                  points={dayPoints.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke="#C8B6FF"
                  strokeOpacity="0.6"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <ol>
                {day.map((d, i) => (
                  <li key={d.time} className="group absolute w-40 -translate-x-1/2 text-center" style={{ left: `${dayPoints[i].x}%`, top: `calc(${dayPoints[i].y}% - 18px)` }}>
                    <Sparkle className="mx-auto h-9 w-9 drop-shadow-[0_0_10px_rgba(255,217,90,0.8)] transition group-hover:scale-125" />
                    <div className="mt-2 rounded-2xl bg-white/8 px-3 py-2 ring-1 ring-white/15 backdrop-blur transition group-hover:bg-white/15">
                      <span className="kicker text-star">{d.time}</span>
                      <p className="font-display font-bold leading-tight">{d.emoji} {d.title}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
        <Wave className="text-night" flip />
      </section>

      {/* News: mission patches */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="kicker text-coral">Mission logs</p>
            <h2 className="text-4xl font-extrabold">Latest news</h2>
          </div>
          <Link href="/news" className="font-display font-bold text-sky">All news →</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {news.map((n) => <NewsCard key={n.id} post={n} />)}
        </div>
      </section>

      {/* Events: launch schedule */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="kicker text-coral">Launch schedule</p>
            <h2 className="text-4xl font-extrabold">Coming up</h2>
          </div>
          <Link href="/events" className="font-display font-bold text-sky">All events →</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {events.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      </section>

      {/* Gallery peek */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="kicker text-coral">Mission photos</p>
            <h2 className="text-4xl font-extrabold">Life on Planet Novaridge</h2>
          </div>
          <Link href="/gallery" className="font-display font-bold text-sky">Open the gallery →</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            ["launch", "Water-rocket launch day", "-rotate-2"],
            ["reading", "Story time on the moon", "rotate-1"],
            ["sports", "Planet sports day", "-rotate-1"],
          ].map(([k, t, r]) => (
            <figure key={k} className={`rounded-[1.5rem] bg-white p-2.5 pb-3 shadow-[0_8px_0_rgba(58,63,191,0.08)] ring-2 ring-ink/5 transition hover:rotate-0 hover:scale-[1.02] ${r}`}>
              <MissionScene kind={k} className="aspect-[400/260] w-full rounded-2xl" title={t} />
              <figcaption className="px-2 pt-2 font-display font-bold">{t}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Portal: Mission Control */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="night relative overflow-hidden rounded-[2.5rem] px-6 py-12 sm:px-12">
          <Starfield />
          <Planet color="#7A4FD6" shade="#3A3FBF" ring="#FFD95A" className="absolute -right-10 -top-10 h-40 w-40 opacity-80" />
          <div className="relative grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="kicker text-glow">Learning portal</p>
              <h2 className="mt-2 text-4xl font-extrabold sm:text-5xl">Welcome to Mission Control</h2>
              <p className="mt-3 text-lg text-white/85">
                Teachers share notes and homework. Pupils take quizzes, earn stars and see their report cards. Parents check attendance and pay fees. One cockpit for the whole crew.
              </p>
              <Link href="/login" className="btn-sun mt-6 text-lg">Log in to Mission Control 🚀</Link>
            </div>
            <div className="relative rounded-[1.75rem] bg-cream p-4 text-ink shadow-[0_0_0_6px_rgba(255,255,255,0.12)]">
              <div className="mb-3 flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-coral" />
                <span className="h-3 w-3 rounded-full bg-sun" />
                <span className="h-3 w-3 rounded-full bg-grass" />
                <span className="kicker ml-2 text-ink/50">mission-control</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["📒", "Notes", "bg-sky-soft"],
                  ["✍️", "Homework", "bg-coral-soft"],
                  ["🧠", "Quizzes", "bg-grape-soft"],
                  ["🏆", "Report cards", "bg-sun-soft"],
                ].map(([e, t, bg]) => (
                  <div key={t} className={`rounded-2xl ${bg} p-4 text-center`}>
                    <div className="text-3xl">{e}</div>
                    <div className="font-display font-bold">{t}</div>
                  </div>
                ))}
              </div>
              <Nova className="absolute -bottom-8 -left-8 h-28 w-auto -rotate-12" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
