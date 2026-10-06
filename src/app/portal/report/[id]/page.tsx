import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/PrintButton";
import { Empty } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { gradeFor } from "@/lib/grades";
import { ordinal, reportFor } from "@/lib/report";
import { school } from "@/lib/school";
import { canViewStudent, lookups } from "@/lib/scope";
import type { Settings } from "@/lib/types";

export const metadata = { title: "Report card" };

const TERMS = ["First Term", "Second Term", "Third Term"];

// The term straight after the given one, so we can say when school resumes.
function nextAfter(session: string, term: string) {
  const i = TERMS.indexOf(term);
  if (i < 2) return `${session}|${TERMS[i + 1]}`;
  const y = Number(session.slice(0, 4)) + 1;
  return `${y}/${y + 1}|First Term`;
}

function resumes(settings: Settings, session: string, term: string) {
  if (settings.session === session && settings.term === term) return settings.nextTermBegins;
  if (nextAfter(session, term) === `${settings.session}|${settings.term}`) return settings.termStarts;
  return "";
}

const TEACHER_REMARK: Record<string, string> = {
  A: "An excellent result. Keep up the hard work and good conduct.",
  B: "A very good term. With a little more effort you can reach the top.",
  C: "A good effort. Pay more attention in class and keep practising.",
  D: "A fair result. More reading at home will make a big difference.",
  E: "Passed, but needs much more effort and support next term.",
  F: "Needs serious improvement. Please see the class teacher.",
};
const PRINCIPAL_REMARK: Record<string, string> = {
  A: "Outstanding. We are proud of you.",
  B: "Very good. Aim higher.",
  C: "Good. You can do better.",
  D: "Work harder next term.",
  E: "More effort is required.",
  F: "Parents are invited to meet the school.",
};

export default async function ReportPage({ params, searchParams }: PageProps<"/portal/report/[id]">) {
  const user = await requireUser();
  const db = await getDB();
  const { id } = await params;
  const sp = await searchParams;
  const s = db.users.find((u) => u.id === id && u.role === "student");
  if (!s || !canViewStudent(user, s)) notFound();
  const { klass, subject } = lookups(db);
  const rep = reportFor(db, s, typeof sp.period === "string" ? sp.period : undefined);
  const back = user.role === "student" ? "/portal/results" : `/portal/students/${s.id}`;

  if (!rep.current)
    return (
      <div className="space-y-4">
        <Link href={back} className="font-display font-semibold text-sky">← Back</Link>
        <Empty emoji="📭" text="No results have been entered for this pupil yet." />
      </div>
    );

  const overall = gradeFor(rep.avg);
  const classTeacher = db.users.find((u) => u.role === "teacher" && u.classIds?.includes(s.classId!));
  const isCurrent = db.settings.session === rep.session && db.settings.term === rep.term;
  const att = isCurrent
    ? db.attendance.filter((r) => r.studentId === s.id && r.date >= db.settings.termStarts && r.date <= db.settings.termEnds)
    : [];
  const present = att.filter((r) => r.status !== "absent").length;
  const resume = resumes(db.settings, rep.session, rep.term);
  const total = rep.rows.reduce((t, r) => t + r.ca + r.exam, 0);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href={back} className="font-display font-semibold text-sky">← Back</Link>
        <div className="flex flex-wrap items-center gap-2">
          {rep.periods.map((p) => (
            <Link
              key={p}
              href={`/portal/report/${s.id}?period=${encodeURIComponent(p)}`}
              className={`chip text-sm ${p === rep.current ? "bg-ink text-white" : "bg-white ring-2 ring-ink/10"}`}
            >
              {p.split("|")[1]} {p.split("|")[0]}
            </Link>
          ))}
          <PrintButton label="🖨️ Print report" />
        </div>
      </div>

      <article className="card border-t-8 border-sky p-6 sm:p-8 print:p-0 print:shadow-none print:ring-0">
        <header className="flex items-center gap-4 border-b-4 border-double border-sky/40 pb-4">
          <Image src={school.logo} alt="" width={80} height={80} className="h-20 w-20 rounded-full" />
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold leading-tight text-sky sm:text-2xl">{school.name.toUpperCase()}</h1>
            <p className="text-xs text-ink/60">{school.address}</p>
            <p className="text-xs italic text-ink/60">Motto: {school.motto}</p>
            <p className="mt-2 inline-block rounded-full bg-sun px-4 py-0.5 font-display text-sm font-bold text-ink">
              TERMLY REPORT · {rep.term.toUpperCase()}, {rep.session}
            </p>
          </div>
          <div className="hidden w-20 sm:block" />
        </header>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-1 py-4 text-sm sm:grid-cols-3">
          <div><dt className="inline text-ink/50">Name: </dt><dd className="inline font-semibold">{s.name}</dd></div>
          <div><dt className="inline text-ink/50">Adm. no: </dt><dd className="inline font-mono">{s.admissionNo ?? "–"}</dd></div>
          <div><dt className="inline text-ink/50">Class: </dt><dd className="inline">{klass(s.classId!)?.name}</dd></div>
          <div><dt className="inline text-ink/50">Gender: </dt><dd className="inline">{s.gender ?? "–"}</dd></div>
          <div><dt className="inline text-ink/50">Pupil type: </dt><dd className="inline">{s.boarding ? "Boarder" : "Day"}</dd></div>
          <div><dt className="inline text-ink/50">Attendance: </dt><dd className="inline">{att.length ? `${present} of ${att.length} days` : "–"}</dd></div>
        </dl>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="bg-sky text-left text-white">
                <th className="px-3 py-2">Subject</th>
                <th className="px-2 py-2 text-center">CA (40)</th>
                <th className="px-2 py-2 text-center">Exam (60)</th>
                <th className="px-2 py-2 text-center">Total (100)</th>
                <th className="px-2 py-2 text-center">Grade</th>
                <th className="px-3 py-2">Teacher&apos;s comment</th>
              </tr>
            </thead>
            <tbody>
              {rep.rows.map((r, i) => {
                const g = gradeFor(r.ca + r.exam);
                return (
                  <tr key={r.id} className={i % 2 ? "bg-cream" : ""}>
                    <td className="px-3 py-2 font-semibold">{subject(r.subjectId)?.name}</td>
                    <td className="px-2 py-2 text-center tabular-nums">{r.ca}</td>
                    <td className="px-2 py-2 text-center tabular-nums">{r.exam}</td>
                    <td className="px-2 py-2 text-center font-bold tabular-nums">{r.ca + r.exam}</td>
                    <td className="px-2 py-2 text-center font-bold">{g.grade}</td>
                    <td className="px-3 py-2 text-ink/70">{r.comment || g.label}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
          {[
            ["Total score", `${total} / ${rep.rows.length * 100}`],
            ["Average", `${rep.avg.toFixed(1)}%`],
            ["Overall grade", `${overall.grade} · ${overall.label}`],
            ["Position", `${ordinal(rep.position)} of ${rep.classSize}`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-sky-soft p-3">
              <div className="text-xs font-bold uppercase text-ink/50">{k}</div>
              <div className="font-display text-lg font-bold">{v}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-3 text-sm">
          <p><b>Class teacher&apos;s remark:</b> {TEACHER_REMARK[overall.grade]} <span className="text-ink/50">({classTeacher?.name ?? "Class teacher"})</span></p>
          <p><b>Head teacher&apos;s remark:</b> {PRINCIPAL_REMARK[overall.grade]}</p>
          {resume && <p><b>Next term begins:</b> {formatDate(resume, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>}
        </div>

        <p className="mt-5 text-xs text-ink/50">
          Grading: A 70–100 Excellent · B 60–69 Very good · C 50–59 Good · D 45–49 Fair · E 40–44 Pass · F 0–39 Fail
        </p>

        <div className="mt-10 flex items-end justify-between gap-6 text-xs text-ink/60">
          <p className="w-40 border-t border-ink/30 pt-1 text-center">Class teacher</p>
          <p className="w-40 border-t border-ink/30 pt-1 text-center">Head teacher &amp; stamp</p>
        </div>
        <p className="mt-6 text-center font-display text-sm text-sky">{school.tagline}</p>
      </article>
    </div>
  );
}
