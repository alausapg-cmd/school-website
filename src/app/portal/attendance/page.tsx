import Link from "next/link";
import { SubmitButton } from "@/components/SubmitButton";
import { Notice, PageHeader, Stat } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { formatDate, today } from "@/lib/format";
import { classIdsFor, studentsIn } from "@/lib/scope";
import type { AttendanceStatus, DB, User } from "@/lib/types";
import { saveAttendance } from "../actions";

export const metadata = { title: "Attendance" };

const STATUS: Record<AttendanceStatus, { label: string; emoji: string; on: string }> = {
  present: { label: "Present", emoji: "😀", on: "peer-checked:bg-grass peer-checked:text-white" },
  late: { label: "Late", emoji: "⏰", on: "peer-checked:bg-sun peer-checked:text-ink" },
  absent: { label: "Absent", emoji: "🏠", on: "peer-checked:bg-coral peer-checked:text-white" },
};
const DOT: Record<AttendanceStatus, string> = { present: "bg-grass", late: "bg-sun", absent: "bg-coral" };

export default async function AttendancePage({ searchParams }: PageProps<"/portal/attendance">) {
  const user = await requireUser();
  const db = await getDB();
  if (user.role === "student") return <StudentAttendance user={user} db={db} />;

  const sp = await searchParams;
  const classIds = classIdsFor(user, db);
  const classId = typeof sp.class === "string" && classIds.includes(sp.class) ? sp.class : classIds[0];
  const date = typeof sp.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(sp.date) ? sp.date : today();
  const students = studentsIn(db, classId);
  const records = db.attendance.filter((r) => r.classId === classId);
  const dayRecords = records.filter((r) => r.date === date);
  const recentDates = [...new Set(records.map((r) => r.date))].sort().slice(-10);

  return (
    <div>
      <PageHeader emoji="📅" title="Attendance" text="Take the register and see who's been in school." />
      {sp.saved && <Notice>✅ Register saved for {formatDate(date, { weekday: "long", day: "numeric", month: "long" })}.</Notice>}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        {db.classes.filter((c) => classIds.includes(c.id)).map((c) => (
          <Link key={c.id} href={`/portal/attendance?class=${c.id}&date=${date}`} className={`chip px-4 py-2 text-sm ${c.id === classId ? "bg-ink text-white" : "bg-white ring-2 ring-ink/10"}`}>
            {c.emoji} {c.name}
          </Link>
        ))}
        <form className="ml-auto flex items-center gap-2">
          <input type="hidden" name="class" value={classId} />
          <input type="date" name="date" defaultValue={date} className="input py-1.5" />
          <button className="btn-ghost py-1.5">Go</button>
        </form>
      </div>

      <form action={saveAttendance.bind(null, classId, date)} className="card mb-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-semibold">Register for {formatDate(date, { weekday: "long", day: "numeric", month: "short" })}</h2>
          {dayRecords.length > 0 && <span className="chip bg-grass-soft text-grass">Already taken, you can update it</span>}
        </div>
        <div className="divide-y-2 divide-ink/5">
          {students.map((s) => {
            const current = dayRecords.find((r) => r.studentId === s.id)?.status ?? "present";
            return (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span className="font-display text-lg font-semibold">{s.avatar} {s.name}</span>
                <div className="flex gap-2">
                  {(Object.keys(STATUS) as AttendanceStatus[]).map((st) => (
                    <label key={st} className="cursor-pointer">
                      <input type="radio" name={`s_${s.id}`} value={st} defaultChecked={current === st} className="peer sr-only" />
                      <span className={`inline-flex items-center gap-1 rounded-full bg-cream px-3 py-1.5 text-sm font-bold ring-2 ring-ink/5 transition peer-focus-visible:ring-sky ${STATUS[st].on}`}>
                        {STATUS[st].emoji} {STATUS[st].label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4"><SubmitButton className="btn-grass">Save register ✅</SubmitButton></div>
      </form>

      <div className="card overflow-x-auto">
        <h2 className="mb-4 text-2xl font-semibold">Last {recentDates.length} school days</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-ink/50">
              <th className="py-2 text-left">Pupil</th>
              {recentDates.map((d) => <th key={d} className="px-1 font-semibold">{formatDate(d, { day: "numeric", month: "numeric" })}</th>)}
              <th className="px-2">%</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const mine = records.filter((r) => r.studentId === s.id);
              const pct = mine.length ? Math.round((mine.filter((r) => r.status !== "absent").length / mine.length) * 100) : 100;
              return (
                <tr key={s.id} className="border-t-2 border-ink/5">
                  <td className="whitespace-nowrap py-2 font-semibold">{s.avatar} {s.name}</td>
                  {recentDates.map((d) => {
                    const st = mine.find((r) => r.date === d)?.status;
                    return (
                      <td key={d} className="px-1 text-center">
                        {st ? <span title={st} className={`inline-block h-4 w-4 rounded-full ${DOT[st]}`} /> : <span className="text-ink/20">·</span>}
                      </td>
                    );
                  })}
                  <td className={`px-2 text-center font-bold ${pct < 85 ? "text-coral" : "text-grass"}`}>{pct}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-3 flex gap-4 text-xs text-ink/60">
          <span><span className="mr-1 inline-block h-3 w-3 rounded-full bg-grass" />Present</span>
          <span><span className="mr-1 inline-block h-3 w-3 rounded-full bg-sun" />Late</span>
          <span><span className="mr-1 inline-block h-3 w-3 rounded-full bg-coral" />Absent</span>
        </p>
      </div>
    </div>
  );
}

function StudentAttendance({ user, db }: { user: User; db: DB }) {
  const mine = db.attendance.filter((r) => r.studentId === user.id).sort((a, b) => b.date.localeCompare(a.date));
  const count = (s: AttendanceStatus) => mine.filter((r) => r.status === s).length;
  const pct = mine.length ? Math.round(((count("present") + count("late")) / mine.length) * 100) : 100;
  return (
    <div>
      <PageHeader emoji="📅" title="My attendance" text={pct >= 95 ? "Wow, you're always here! 🌟" : "Every day in school is a day of learning!"} />
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat emoji="🎯" value={`${pct}%`} label="Attendance" bg="bg-sky-soft" />
        <Stat emoji="😀" value={count("present")} label="Days present" bg="bg-grass-soft" />
        <Stat emoji="⏰" value={count("late")} label="Days late" bg="bg-sun-soft" />
        <Stat emoji="🏠" value={count("absent")} label="Days absent" bg="bg-coral-soft" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {mine.map((r) => (
          <div key={r.date} className="card p-4 text-center">
            <div className="text-xs font-bold uppercase text-ink/50">{formatDate(r.date, { weekday: "short" })}</div>
            <div className="font-display text-lg font-semibold">{formatDate(r.date, { day: "numeric", month: "short" })}</div>
            <div className="text-3xl">{STATUS[r.status].emoji}</div>
            <div className="text-xs font-semibold">{STATUS[r.status].label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
