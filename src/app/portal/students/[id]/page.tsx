import Link from "next/link";
import { notFound } from "next/navigation";
import { SubmitButton } from "@/components/SubmitButton";
import { Notice, Stat } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { FEE_STATE, feeStatus, naira } from "@/lib/fees";
import { formatDate } from "@/lib/format";
import { gradeFor } from "@/lib/grades";
import { canViewStudent, lookups } from "@/lib/scope";
import { updateStudent } from "../../actions";

function age(dob?: string) {
  if (!dob) return null;
  const d = new Date(dob), n = new Date();
  return n.getFullYear() - d.getFullYear() - (n < new Date(n.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0);
}

export default async function StudentProfile({ params, searchParams }: PageProps<"/portal/students/[id]">) {
  const user = await requireUser("admin", "teacher", "parent");
  const db = await getDB();
  const { id } = await params;
  const sp = await searchParams;
  const s = db.users.find((u) => u.id === id && u.role === "student");
  if (!s || !canViewStudent(user, s)) notFound();
  const { klass, subject, user: who } = lookups(db);
  const parent = s.parentId ? who(s.parentId) : undefined;
  const showFees = user.role !== "teacher";
  const fees = feeStatus(db, s);
  const att = db.attendance.filter((r) => r.studentId === s.id);
  const pct = att.length ? Math.round((att.filter((r) => r.status !== "absent").length / att.length) * 100) : 100;
  const periods = [...new Set(db.results.filter((r) => r.studentId === s.id).map((r) => `${r.session}|${r.term}`))].sort().reverse();
  const latest = periods[0];
  const rows = latest ? db.results.filter((r) => r.studentId === s.id && `${r.session}|${r.term}` === latest) : [];
  const avg = rows.length ? rows.reduce((t, r) => t + r.ca + r.exam, 0) / rows.length : 0;
  const hw = db.submissions.filter((x) => x.studentId === s.id);
  const back = user.role === "parent" ? "/portal" : "/portal/students";

  return (
    <div className="space-y-6">
      <Link href={back} className="font-display font-semibold text-sky">← {user.role === "parent" ? "My children" : "All students"}</Link>
      {sp.added && <Notice>✅ Pupil enrolled with admission number {s.admissionNo}.</Notice>}
      {sp.saved && <Notice>✅ Details saved.</Notice>}

      <div className="card flex flex-wrap items-center gap-6">
        <span className="grid h-24 w-24 place-items-center rounded-3xl bg-sun-soft text-6xl">{s.avatar}</span>
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold">{s.name}</h1>
          <div className="mt-1 flex flex-wrap gap-2 text-sm">
            <span className="chip bg-sky-soft text-sky">{klass(s.classId!)?.name}</span>
            <span className="chip bg-ink/5 font-mono">{s.admissionNo}</span>
            <span className="chip bg-grape-soft text-grape">{s.boarding ? "🌙 Extended day" : "☀️ Standard day"}</span>
            {s.gender && <span className="chip bg-ink/5">{s.gender}{age(s.dob) !== null ? `, ${age(s.dob)} years` : ""}</span>}
          </div>
          <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
            <div><dt className="inline text-ink/50">Date of birth: </dt><dd className="inline">{s.dob ? formatDate(s.dob) : "–"}</dd></div>
            <div><dt className="inline text-ink/50">Admitted: </dt><dd className="inline">{s.admittedOn ? formatDate(s.admittedOn) : "–"}</dd></div>
            <div><dt className="inline text-ink/50">Parent: </dt><dd className="inline">{parent ? `${parent.name} · ${parent.phone ?? parent.email}` : "–"}</dd></div>
            <div><dt className="inline text-ink/50">Address: </dt><dd className="inline">{s.address || "–"}</dd></div>
          </dl>
        </div>
        <Link href={`/portal/report/${s.id}`} className="btn-primary">🖨️ Report card</Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat emoji="📅" value={`${pct}%`} label="Attendance" bg="bg-grass-soft" />
        <Stat emoji="📊" value={rows.length ? `${avg.toFixed(1)}%` : "–"} label={latest ? `Average, ${latest.split("|")[1]}` : "No results yet"} bg="bg-sky-soft" />
        <Stat emoji="✍️" value={hw.length} label="Assignments handed in" bg="bg-sun-soft" />
        {showFees ? (
          <Stat emoji="💳" value={fees.balance > 0 ? naira(fees.balance) : "Paid"} label={fees.balance > 0 ? "Fees outstanding" : "Fees this term"} bg={fees.balance > 0 ? "bg-coral-soft" : "bg-grass-soft"} />
        ) : (
          <Stat emoji="🧠" value={db.attempts.filter((a) => a.studentId === s.id).length} label="Quizzes taken" bg="bg-grape-soft" />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h2 className="mb-3 text-2xl font-semibold">🏆 {latest ? `${latest.split("|")[1]}, ${latest.split("|")[0]}` : "Results"}</h2>
          {rows.length ? (
            <table className="w-full text-sm">
              <tbody className="divide-y-2 divide-ink/5">
                {rows.map((r) => {
                  const g = gradeFor(r.ca + r.exam);
                  return (
                    <tr key={r.id}>
                      <td className="py-2">{subject(r.subjectId)?.emoji} {subject(r.subjectId)?.name}</td>
                      <td className="text-right tabular-nums">{r.ca + r.exam}</td>
                      <td className="w-12 text-right"><span className={`chip ${g.color}`}>{g.grade}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-ink/60">No results recorded yet.</p>
          )}
        </section>

        {showFees && (
          <section className="card">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-2xl font-semibold">💳 Fees, {db.settings.term}</h2>
              <span className={`chip ${FEE_STATE[fees.state].cls}`}>{FEE_STATE[fees.state].label}</span>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y-2 divide-ink/5">
                {fees.lines.map((f) => (
                  <tr key={f.id}><td className="py-1.5">{f.name}</td><td className="text-right tabular-nums">{naira(f.amount)}</td></tr>
                ))}
                <tr className="font-bold"><td className="py-2">Total</td><td className="text-right tabular-nums">{naira(fees.billed)}</td></tr>
                <tr className="text-grass"><td className="py-1.5">Paid</td><td className="text-right tabular-nums">{naira(fees.paid)}</td></tr>
                <tr className={fees.balance > 0 ? "font-bold text-coral" : "font-bold text-grass"}><td className="py-1.5">Balance</td><td className="text-right tabular-nums">{naira(Math.max(0, fees.balance))}</td></tr>
              </tbody>
            </table>
            {fees.payments.length > 0 && (
              <div className="mt-3 space-y-1 text-sm">
                <p className="font-semibold text-ink/60">Payments</p>
                {fees.payments.map((p) => (
                  <Link key={p.id} href={`/portal/fees/receipt/${p.id}`} className="flex justify-between rounded-xl bg-cream px-3 py-2 hover:bg-sky-soft">
                    <span>{formatDate(p.date)} · {p.method}</span>
                    <span className="font-semibold tabular-nums">{naira(p.amount)} 🧾</span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {user.role === "admin" && (
        <details className="card">
          <summary className="cursor-pointer font-display text-xl font-semibold">✏️ Edit details</summary>
          <form action={updateStudent.bind(null, s.id)} className="mt-4 grid gap-4 sm:grid-cols-3">
            <div><label className="label">Full name</label><input name="name" defaultValue={s.name} className="input" /></div>
            <div>
              <label className="label">Class</label>
              <select name="classId" defaultValue={s.classId} className="input">{db.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            </div>
            <div>
              <label className="label">Gender</label>
              <select name="gender" defaultValue={s.gender} className="input"><option>Female</option><option>Male</option></select>
            </div>
            <div><label className="label">Date of birth</label><input name="dob" type="date" defaultValue={s.dob} className="input" /></div>
            <div>
              <label className="label">Day plan</label>
              <select name="boarding" defaultValue={s.boarding ? "yes" : "no"} className="input"><option value="no">Standard day</option><option value="yes">Extended day</option></select>
            </div>
            <div><label className="label">Address</label><input name="address" defaultValue={s.address} className="input" /></div>
            <div><SubmitButton>Save changes</SubmitButton></div>
          </form>
        </details>
      )}
    </div>
  );
}
