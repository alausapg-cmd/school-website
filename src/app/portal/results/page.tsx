import Link from "next/link";
import { SubmitButton } from "@/components/SubmitButton";
import { Empty, Notice, PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { gradeFor } from "@/lib/grades";
import { school } from "@/lib/school";
import { classIdsFor, lookups, studentsIn, subjectsFor } from "@/lib/scope";
import type { DB, User } from "@/lib/types";
import { saveResults } from "../actions";

export const metadata = { title: "Results" };

const TERMS = ["First Term", "Second Term", "Third Term"];

export default async function ResultsPage({ searchParams }: PageProps<"/portal/results">) {
  const user = await requireUser();
  const db = await getDB();
  const sp = await searchParams;
  if (user.role === "student") return <ReportCard user={user} db={db} term={sp.term as string | undefined} />;

  const classIds = classIdsFor(user, db);
  const subjects = subjectsFor(user, db);
  const pick = (k: string, ok: string[], d: string) => (typeof sp[k] === "string" && ok.includes(sp[k] as string) ? (sp[k] as string) : d);
  const classId = pick("class", classIds, classIds[0]);
  const subjectId = pick("subject", subjects.map((s) => s.id), subjects[0].id);
  const term = pick("term", TERMS, school.currentTerm);
  const session = typeof sp.session === "string" && /^\d{4}\/\d{4}$/.test(sp.session) ? sp.session : school.currentSession;
  const students = studentsIn(db, classId);
  const { klass, subject } = lookups(db);

  return (
    <div>
      <PageHeader emoji="🏆" title="Results" text="Enter continuous assessment (out of 40) and exam scores (out of 60)." />
      {sp.saved && <Notice>✅ Results saved for {subject(subjectId)?.name}, {klass(classId)?.name}.</Notice>}
      <form className="card mb-6 grid gap-3 sm:grid-cols-5 sm:items-end">
        <div>
          <label className="label">Class</label>
          <select name="class" defaultValue={classId} className="input">
            {db.classes.filter((c) => classIds.includes(c.id)).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Subject</label>
          <select name="subject" defaultValue={subjectId} className="input">
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Term</label>
          <select name="term" defaultValue={term} className="input">
            {TERMS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Session</label>
          <input name="session" defaultValue={session} className="input" pattern="\d{4}/\d{4}" />
        </div>
        <button className="btn-ghost">Show</button>
      </form>

      <form action={saveResults.bind(null, classId, subjectId, term, session)} className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead className="text-sm text-ink/50">
            <tr><th className="py-2">Pupil</th><th>CA /40</th><th>Exam /60</th><th>Total</th><th>Comment</th></tr>
          </thead>
          <tbody className="divide-y-2 divide-ink/5">
            {students.map((s) => {
              const r = db.results.find((x) => x.studentId === s.id && x.subjectId === subjectId && x.term === term && x.session === session);
              const g = r ? gradeFor(r.ca + r.exam) : null;
              return (
                <tr key={s.id}>
                  <td className="whitespace-nowrap py-2 pr-2 font-semibold">{s.avatar} {s.name}</td>
                  <td className="pr-2"><input name={`ca_${s.id}`} type="number" min={0} max={40} defaultValue={r?.ca} className="input w-20 py-1.5" /></td>
                  <td className="pr-2"><input name={`exam_${s.id}`} type="number" min={0} max={60} defaultValue={r?.exam} className="input w-20 py-1.5" /></td>
                  <td className="pr-2">{r && g ? <span className={`chip ${g.color}`}>{r.ca + r.exam} · {g.grade}</span> : <span className="text-ink/30">–</span>}</td>
                  <td><input name={`comment_${s.id}`} defaultValue={r?.comment} className="input py-1.5" placeholder="Keep shining!" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-4"><SubmitButton className="btn-grass">Save results 🏆</SubmitButton></div>
      </form>
    </div>
  );
}

function ReportCard({ user, db, term }: { user: User; db: DB; term?: string }) {
  const { subject } = lookups(db);
  const mine = db.results.filter((r) => r.studentId === user.id);
  const periods = [...new Set(mine.map((r) => `${r.session}|${r.term}`))].sort().reverse();
  const current = term && periods.includes(term) ? term : periods[0];
  if (!current)
    return (
      <div>
        <PageHeader emoji="🏆" title="My report card" />
        <Empty emoji="📭" text="No results yet. Check back at the end of term!" />
      </div>
    );
  const [session, termName] = current.split("|");
  const rows = mine.filter((r) => r.session === session && r.term === termName);
  const avg = rows.reduce((s, r) => s + r.ca + r.exam, 0) / rows.length;
  const overall = gradeFor(avg);
  // Position in class for this term.
  const classmates = studentsIn(db, user.classId!);
  const averages = classmates
    .map((c) => {
      const rs = db.results.filter((r) => r.studentId === c.id && r.session === session && r.term === termName);
      return { id: c.id, avg: rs.length ? rs.reduce((s, r) => s + r.ca + r.exam, 0) / rs.length : 0 };
    })
    .sort((a, b) => b.avg - a.avg);
  const position = averages.findIndex((a) => a.id === user.id) + 1;
  const ord = (n: number) => n + (["th", "st", "nd", "rd"][(n % 100 > 10 && n % 100 < 14) ? 0 : n % 10] ?? "th");

  return (
    <div>
      <PageHeader emoji="🏆" title="My report card" text={`${termName}, ${session}`}>
        {periods.length > 1 && (
          <div className="flex gap-2">
            {periods.map((p) => (
              <Link key={p} href={`/portal/results?term=${encodeURIComponent(p)}`} className={`chip text-sm ${p === current ? "bg-ink text-white" : "bg-white ring-2 ring-ink/10"}`}>
                {p.split("|")[1]} {p.split("|")[0]}
              </Link>
            ))}
          </div>
        )}
      </PageHeader>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className={`rounded-3xl p-6 text-center ${overall.color}`}>
          <div className="text-5xl">{overall.emoji}</div>
          <div className="font-display text-5xl font-bold">{overall.grade}</div>
          <div className="font-semibold">{overall.label}</div>
        </div>
        <div className="rounded-3xl bg-sky-soft p-6 text-center">
          <div className="text-5xl">📊</div>
          <div className="font-display text-5xl font-bold">{avg.toFixed(1)}%</div>
          <div className="font-semibold">Average score</div>
        </div>
        <div className="rounded-3xl bg-grape-soft p-6 text-center">
          <div className="text-5xl">🎖️</div>
          <div className="font-display text-5xl font-bold">{ord(position)}</div>
          <div className="font-semibold">in class of {classmates.length}</div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((r) => {
          const s = subject(r.subjectId);
          const total = r.ca + r.exam;
          const g = gradeFor(total);
          return (
            <div key={r.id} className="card">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{s?.emoji} {s?.name}</h3>
                <span className={`chip px-3 text-base ${g.color}`}>{g.grade}</span>
              </div>
              <div className="mt-3 h-4 overflow-hidden rounded-full bg-cream">
                <div className="h-full rounded-full" style={{ width: `${total}%`, background: s?.color }} />
              </div>
              <div className="mt-2 flex justify-between text-sm text-ink/70">
                <span>CA {r.ca}/40 · Exam {r.exam}/60</span>
                <b>{total}/100</b>
              </div>
              {r.comment && <p className="mt-2 text-sm italic text-ink/70">&ldquo;{r.comment}&rdquo;</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
