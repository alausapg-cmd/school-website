import Link from "next/link";
import { Empty, HootBanner, Stars, Stat, SubjectChip } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { formatDate, today } from "@/lib/format";
import { starsFor } from "@/lib/grades";
import { resetDemo } from "./actions";
import { FEE_STATE, feeStatus, naira } from "@/lib/fees";
import { reportFor } from "@/lib/report";
import { school } from "@/lib/school";
import { childrenOf, classIdsFor, lookups, noticesFor } from "@/lib/scope";
import type { DB, Notice, User } from "@/lib/types";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export default async function Dashboard() {
  const user = await requireUser();
  const db = await getDB();
  if (user.role === "student") return <StudentHome user={user} db={db} />;
  if (user.role === "teacher") return <TeacherHome user={user} db={db} />;
  if (user.role === "parent") return <ParentHome user={user} db={db} />;
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
      <HootBanner title={<>{greeting()}, {first}! {user.avatar}</>} text="Hoo-hoo! Ready for another adventure in learning?" />
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
        <h2 className="mb-4 text-2xl font-bold">📒 New notes from your teachers</h2>
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
      <HootBanner
        title={<>{greeting()}, {user.name.split(" ").slice(0, 2).join(" ")} {user.avatar}</>}
        text={<>{db.settings.term}, {db.settings.session} · {classIds.map((c) => klass(c)?.name).join(", ")}</>}
      />
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
            ["/portal/notes#new", "📤", "Upload notes", "wood shadow-[0_5px_0_#4A2D12]"],
            ["/portal/assignments#new", "✍️", "Set homework", "bg-coral text-white shadow-[0_5px_0_#7D0F3A]"],
            ["/portal/quizzes/new", "🧠", "Build a quiz", "bg-grape text-white shadow-[0_5px_0_#3E1757]"],
            ["/portal/attendance", "✅", "Take register", "bg-grass text-white shadow-[0_5px_0_#245A1C]"],
          ].map(([href, e, t, bg]) => (
            <Link key={href} href={href} className={`${bg} rounded-3xl p-5 transition hover:-translate-y-1 hover:rotate-1`}>
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

function NoticeList({ notices, db }: { notices: Notice[]; db: DB }) {
  const { user: who } = lookups(db);
  if (!notices.length) return <Empty emoji="📭" text="No notices right now." />;
  return (
    <ul className="space-y-3">
      {notices.map((n) => (
        <li key={n.id} className="rounded-2xl bg-cream p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display font-semibold">{n.pinned ? "📌 " : ""}{n.title}</h3>
            <span className="shrink-0 text-xs text-ink/50">{formatDate(n.date, { day: "numeric", month: "short" })}</span>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-ink/70">{n.body}</p>
          <p className="mt-1 text-xs text-ink/50">{who(n.authorId)?.name}</p>
        </li>
      ))}
    </ul>
  );
}

function ParentHome({ user, db }: { user: User; db: DB }) {
  const { klass } = lookups(db);
  const kids = childrenOf(db, user);
  return (
    <div className="space-y-8">
      <HootBanner
        title={<>{greeting()}, {user.name.split(" ").slice(0, 2).join(" ")} 👋</>}
        text={<>
          {db.settings.term}, {db.settings.session}
          {db.settings.termEnds ? ` · Term ends ${formatDate(db.settings.termEnds, { day: "numeric", month: "long" })}` : ""}
        </>}
      />
      <section>
        <h2 className="mb-4 text-2xl font-semibold">👧🏽 My children</h2>
        {kids.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {kids.map((k) => {
              const att = db.attendance.filter((r) => r.studentId === k.id);
              const pct = att.length ? Math.round((att.filter((r) => r.status !== "absent").length / att.length) * 100) : 100;
              const rep = reportFor(db, k);
              const fee = feeStatus(db, k);
              const hw = db.assignments.filter((a) => a.classId === k.classId).length;
              const done = db.submissions.filter((x) => x.studentId === k.id).length;
              return (
                <div key={k.id} className="card space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-sun-soft text-4xl">{k.avatar}</span>
                    <div className="min-w-0">
                      <h3 className="text-xl font-semibold">{k.name}</h3>
                      <p className="text-sm text-ink/60">{klass(k.classId!)?.name} · {k.boarding ? "Boarder" : "Day pupil"} · <span className="font-mono">{k.admissionNo}</span></p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-2xl bg-grass-soft p-3"><div className="font-display text-2xl font-bold">{pct}%</div><div className="text-xs font-semibold text-ink/60">Attendance</div></div>
                    <div className="rounded-2xl bg-sky-soft p-3"><div className="font-display text-2xl font-bold">{rep.current ? `${rep.avg.toFixed(0)}%` : "–"}</div><div className="text-xs font-semibold text-ink/60">Last average</div></div>
                    <div className="rounded-2xl bg-grape-soft p-3"><div className="font-display text-2xl font-bold">{done}/{hw}</div><div className="text-xs font-semibold text-ink/60">Homework done</div></div>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-cream p-3 text-sm">
                    <span>School fees: <b>{fee.balance > 0 ? `${naira(fee.balance)} to pay` : naira(fee.paid)}</b></span>
                    <span className={`chip ${FEE_STATE[fee.state].cls}`}>{FEE_STATE[fee.state].label}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/portal/students/${k.id}`} className="btn-primary px-4 py-2 text-sm">Full profile</Link>
                    {rep.current && <Link href={`/portal/report/${k.id}`} className="btn-ghost px-4 py-2 text-sm">🏆 Report card</Link>}
                    <Link href="/portal/fees" className="btn-ghost px-4 py-2 text-sm">💳 Fees</Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Empty emoji="👪" text="No children are linked to your account yet. Please contact the school office." />
        )}
      </section>
      <section className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">📢 Notices from school</h2>
          <Link href="/portal/notices" className="font-display font-semibold text-sky">All notices →</Link>
        </div>
        <NoticeList notices={noticesFor(db, user).slice(0, 3)} db={db} />
      </section>
    </div>
  );
}

function AdminHome({ db }: { db: DB }) {
  const count = (r: string) => db.users.filter((u) => u.role === r).length;
  const pupils = db.users.filter((u) => u.role === "student");
  const fees = pupils.map((p) => feeStatus(db, p));
  const billed = fees.reduce((t, f) => t + f.billed, 0);
  const paid = fees.reduce((t, f) => t + Math.min(f.paid, f.billed), 0);
  const owing = fees.filter((f) => f.balance > 0).length;
  const pending = db.applications.filter((a) => a.status === "pending" || a.status === "exam booked").length;
  const boarders = pupils.filter((p) => p.boarding).length;
  const todayRecords = db.attendance.filter((r) => r.date === today());
  const inToday = todayRecords.filter((r) => r.status !== "absent").length;
  const pct = billed ? Math.round((paid / billed) * 100) : 0;
  return (
    <div className="space-y-8">
      <HootBanner title="School overview 👑" text={<>{school.name} · {db.settings.term}, {db.settings.session}</>} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat emoji="🧒" value={pupils.length} label={`Pupils (${boarders} boarders)`} bg="bg-sky-soft" />
        <Stat emoji="👩‍🏫" value={count("teacher")} label="Teachers" bg="bg-grass-soft" />
        <Stat emoji="📝" value={pending} label="Admission applications open" bg="bg-sun-soft" />
        <Stat emoji="✅" value={todayRecords.length ? `${inToday}/${todayRecords.length}` : "–"} label="In school today" bg="bg-grape-soft" />
      </div>
      <section className="card">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-semibold">💳 School fees this term</h2>
            <p className="text-ink/60">{naira(paid)} collected of {naira(billed)} · {owing} pupils still owing</p>
          </div>
          <Link href="/portal/fees" className="btn-ghost px-4 py-2 text-sm">Open fees</Link>
        </div>
        <div className="mt-4 h-5 overflow-hidden rounded-full bg-cream ring-2 ring-wood/15">
          <div className="h-full rounded-full bg-[linear-gradient(90deg,#3A8A2E,#7CC24A)]" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1 text-right text-sm font-semibold">{pct}% collected</p>
      </section>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          ["/portal/students", "🧒", "Students", "Enrol pupils and view records."],
          ["/portal/fees", "💳", "Record a payment", "Issue a receipt in seconds."],
          ["/portal/admissions", "📝", "Admissions", "Review online applications."],
          ["/portal/notices", "📢", "Send a notice", "Reach parents, pupils or staff."],
          ["/portal/timetable", "🗓️", "Timetables", "Set each class's lessons."],
          ["/portal/results", "🏆", "Results", "Enter and check scores."],
          ["/portal/news", "📰", "Website news", "Post stories on the website."],
          ["/portal/settings", "⚙️", "Settings", "Term, session, classes, subjects."],
        ].map(([href, e, t, d]) => (
          <Link key={href} href={href} className="card transition hover:-translate-y-1">
            <div className="text-3xl">{e}</div>
            <h3 className="mt-2 text-lg font-semibold">{t}</h3>
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
