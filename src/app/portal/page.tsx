import Link from "next/link";
import { Empty, Stars, Stat, SubjectChip } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { formatDate, today } from "@/lib/format";
import { starsFor } from "@/lib/grades";
import { resetDemo } from "./actions";
import { school } from "@/lib/school";
import { classIdsFor, lookups } from "@/lib/scope";
import type { DB, User } from "@/lib/types";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export default async function Dashboard() {
  const user = await requireUser();
  const db = await getDB();
  if (user.role === "student") return <StudentHome user={user} db={db} />;
  if (user.role === "teacher") return <TeacherHome user={user} db={db} />;
  return <AdminHome db={db} />;
}

function StudentHome({ user, db }: { user: User; db: DB }) {
  const { subject } = lookups(db);
  const first = user.name.split(" ")[0];
  const mine = db.attempts.filter((a) => a.studentId === user.id);
  const stars = mine.reduce((s, a) => s + starsFor((a.score / a.total) * 100), 0);
  const submitted = new Set(db.submissions.filter((s) => s.studentId === user.id).map((s) => s.assignmentId));
  const due = db.assignments
    .filter((a) => a.classId === user.classId && !submitted.has(a.id))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const doneQuizzes = new Set(mine.map((a) => a.quizId));
  const quizzes = db.quizzes.filter((q) => q.classId === user.classId && !doneQuizzes.has(q.id));
  const notes = db.notes.filter((n) => n.classId === user.classId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3);
  const att = db.attendance.filter((r) => r.studentId === user.id);
  const present = att.length ? Math.round((att.filter((r) => r.status !== "absent").length / att.length) * 100) : 100;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-sky p-8 text-white">
        <div className="absolute -right-4 -top-6 text-[8rem] opacity-30" aria-hidden>{user.avatar}</div>
        <h1 className="relative text-4xl font-bold">{greeting()}, {first}! 👋</h1>
        <p className="relative mt-1 text-lg opacity-90">Ready for another awesome day of learning?</p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat emoji="⭐" value={stars} label="Stars collected" bg="bg-sun-soft" />
        <Stat emoji="✍️" value={due.length} label="Homework to do" bg="bg-coral-soft" />
        <Stat emoji="🧠" value={quizzes.length} label="New quizzes" bg="bg-grape-soft" />
        <Stat emoji="📅" value={`${present}%`} label="In school this term" bg="bg-grass-soft" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h2 className="mb-4 text-2xl font-semibold">✍️ Homework to do</h2>
          {due.length ? (
            <ul className="space-y-3">
              {due.map((a) => {
                const late = a.dueDate < today();
                return (
                  <li key={a.id}>
                    <Link href={`/portal/assignments/${a.id}`} className="flex items-center justify-between gap-3 rounded-2xl bg-cream p-4 transition hover:bg-sky-soft">
                      <div>
                        <div className="font-display font-semibold">{a.title}</div>
                        <SubjectChip subject={subject(a.subjectId)} />
                      </div>
                      <span className={`chip shrink-0 ${late ? "bg-coral-soft text-coral" : "bg-sun-soft"}`}>
                        {late ? "Late!" : `Due ${formatDate(a.dueDate, { day: "numeric", month: "short" })}`}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Empty emoji="🎉" text="All done! No homework waiting." />
          )}
        </section>
        <section className="card">
          <h2 className="mb-4 text-2xl font-semibold">🧠 Quizzes waiting for you</h2>
          {quizzes.length ? (
            <ul className="space-y-3">
              {quizzes.map((q) => (
                <li key={q.id}>
                  <Link href={`/portal/quizzes/${q.id}`} className="flex items-center justify-between gap-3 rounded-2xl bg-grape-soft p-4 transition hover:-translate-y-0.5">
                    <div>
                      <div className="font-display font-semibold">{q.title}</div>
                      <div className="text-sm text-ink/60">{q.questions.length} questions</div>
                    </div>
                    <span className="btn-grass px-4 py-1.5 text-sm">Start ▶</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty emoji="🌟" text="You've done every quiz. Superstar!" />
          )}
          {mine.length > 0 && (
            <div className="mt-4 text-sm text-ink/60">
              Last quiz: <Stars count={starsFor((mine[mine.length - 1].score / mine[mine.length - 1].total) * 100)} />
            </div>
          )}
        </section>
      </div>
      <section>
        <h2 className="mb-4 text-2xl font-semibold">📒 New notes from your teachers</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {notes.map((n) => (
            <Link key={n.id} href={`/portal/notes/${n.id}`} className="card transition hover:-translate-y-1">
              <SubjectChip subject={subject(n.subjectId)} />
              <h3 className="mt-2 text-lg font-semibold">{n.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-ink/60">{n.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function TeacherHome({ user, db }: { user: User; db: DB }) {
  const { subject, klass, user: who } = lookups(db);
  const classIds = classIdsFor(user, db);
  const myAsg = db.assignments.filter((a) => a.teacherId === user.id);
  const toMark = db.submissions.filter((s) => s.score === undefined && myAsg.some((a) => a.id === s.assignmentId));
  const takenToday = classIds.filter((c) => db.attendance.some((r) => r.classId === c && r.date === today()));
  const pupils = db.users.filter((u) => u.role === "student" && classIds.includes(u.classId!)).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">{greeting()}, {user.name.split(" ").slice(0, 2).join(" ")} {user.avatar}</h1>
        <p className="text-ink/60">{school.currentTerm}, {school.currentSession} · {classIds.map((c) => klass(c)?.name).join(", ")}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat emoji="🧒" value={pupils} label="Pupils in my classes" bg="bg-sky-soft" />
        <Stat emoji="📝" value={toMark.length} label="Submissions to mark" bg="bg-coral-soft" />
        <Stat emoji="🧠" value={db.quizzes.filter((q) => q.teacherId === user.id).length} label="Assessments set" bg="bg-grape-soft" />
        <Stat emoji="📅" value={`${takenToday.length}/${classIds.length}`} label="Registers taken today" bg="bg-grass-soft" />
      </div>
      <section>
        <h2 className="mb-4 text-2xl font-semibold">⚡ Quick actions</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ["/portal/notes#new", "📤", "Upload notes", "bg-sun"],
            ["/portal/assignments#new", "✍️", "Set homework", "bg-coral"],
            ["/portal/quizzes/new", "🧠", "Build a quiz", "bg-grape"],
            ["/portal/attendance", "✅", "Take register", "bg-grass"],
          ].map(([href, e, t, bg]) => (
            <Link key={href} href={href} className={`${bg} rounded-3xl p-5 text-white transition hover:-translate-y-1 hover:rotate-1`}>
              <div className="text-4xl">{e}</div>
              <div className="mt-2 font-display text-lg font-semibold">{t}</div>
            </Link>
          ))}
        </div>
      </section>
      <section className="card">
        <h2 className="mb-4 text-2xl font-semibold">📝 Waiting to be marked</h2>
        {toMark.length ? (
          <ul className="divide-y-2 divide-ink/5">
            {toMark.map((s) => {
              const a = myAsg.find((x) => x.id === s.assignmentId)!;
              return (
                <li key={s.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <div className="font-semibold">{who(s.studentId)?.avatar} {who(s.studentId)?.name}</div>
                    <div className="text-sm text-ink/60">{a.title} · <SubjectChip subject={subject(a.subjectId)} /></div>
                  </div>
                  <Link href={`/portal/assignments/${a.id}`} className="btn-ghost px-4 py-1.5 text-sm">Mark</Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <Empty emoji="☕" text="Nothing to mark right now." />
        )}
      </section>
    </div>
  );
}

function AdminHome({ db }: { db: DB }) {
  const count = (r: string) => db.users.filter((u) => u.role === r).length;
  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">School overview 👑</h1>
        <p className="text-ink/60">{school.name} · {school.currentTerm}, {school.currentSession}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat emoji="🧒" value={count("student")} label="Pupils" bg="bg-sky-soft" />
        <Stat emoji="👩‍🏫" value={count("teacher")} label="Teachers" bg="bg-grass-soft" />
        <Stat emoji="📰" value={db.news.length} label="News stories" bg="bg-coral-soft" />
        <Stat emoji="🎉" value={db.events.filter((e) => e.date >= today()).length} label="Upcoming events" bg="bg-grape-soft" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["/portal/news", "📰", "Post school news", "Share stories on the public website."],
          ["/portal/events", "🎉", "Add an event", "Let families know what's coming up."],
          ["/portal/people", "👥", "Manage people", "Add teachers and pupils to the portal."],
        ].map(([href, e, t, d]) => (
          <Link key={href} href={href} className="card transition hover:-translate-y-1">
            <div className="text-4xl">{e}</div>
            <h3 className="mt-2 text-xl font-semibold">{t}</h3>
            <p className="text-sm text-ink/60">{d}</p>
          </Link>
        ))}
      </div>
      <form action={resetDemo} className="card flex flex-wrap items-center justify-between gap-4 bg-sun-soft">
        <div>
          <h3 className="text-lg font-semibold">🧪 Demo mode</h3>
          <p className="text-sm text-ink/70">This portal is running on sample data. Reset it to start the demo fresh.</p>
        </div>
        <button className="btn-ghost">Reset sample data</button>
      </form>
    </div>
  );
}
