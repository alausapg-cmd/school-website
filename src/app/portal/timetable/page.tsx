import Link from "next/link";
import { Fragment } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import { Empty, Notice, PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { DAYS, PERIODS, childrenOf, classIdsFor, lookups } from "@/lib/scope";
import { saveTimetable } from "../actions";

export const metadata = { title: "Timetable" };

export default async function TimetablePage({ searchParams }: PageProps<"/portal/timetable">) {
  const user = await requireUser();
  const db = await getDB();
  const sp = await searchParams;
  const { subject, klass } = lookups(db);
  const classIds = user.role === "parent" ? [...new Set(childrenOf(db, user).map((c) => c.classId!))] : classIdsFor(user, db);
  if (!classIds.length) return <Empty emoji="🗓️" text="No class timetable to show yet." />;
  const classId = typeof sp.class === "string" && classIds.includes(sp.class) ? sp.class : classIds[0];
  const slot = (day: number, period: number) => db.timetable.find((t) => t.classId === classId && t.day === day && t.period === period);
  const editing = user.role === "admin" && sp.edit === "1";
  const todayIdx = new Date().getDay(); // 1 = Monday

  return (
    <div>
      <PageHeader emoji="🗓️" title="Class timetable" text={`${klass(classId)?.name} · ${db.settings.term}, ${db.settings.session}`}>
        {user.role === "admin" && !editing && (
          <Link href={`/portal/timetable?class=${classId}&edit=1`} className="btn-primary">✏️ Edit timetable</Link>
        )}
      </PageHeader>
      {sp.saved && <Notice>✅ Timetable saved for {klass(classId)?.name}.</Notice>}
      {classIds.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {classIds.map((c) => (
            <Link key={c} href={`/portal/timetable?class=${c}`} className={`chip py-2 ${c === classId ? "bg-ink text-white" : "bg-white ring-2 ring-ink/10"}`}>
              {klass(c)?.emoji} {klass(c)?.name}
            </Link>
          ))}
        </div>
      )}

      <form action={saveTimetable.bind(null, classId)} className="card overflow-x-auto p-4">
        <table className="w-full min-w-[720px] border-separate border-spacing-1 text-sm">
          <thead>
            <tr>
              <th className="w-28 text-left text-ink/50">Period</th>
              {DAYS.map((d, i) => (
                <th key={d} className={`rounded-xl py-2 ${i + 1 === todayIdx ? "bg-sun" : "bg-sky-soft"}`}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map((p) => (
              <Fragment key={p.n}>
                {p.n === 4 && (
                  <tr><td colSpan={6} className="rounded-xl bg-grass-soft py-1 text-center text-xs font-bold uppercase text-grass">Short break · 10:00 – 10:30</td></tr>
                )}
                {p.n === 6 && (
                  <tr><td colSpan={6} className="rounded-xl bg-grass-soft py-1 text-center text-xs font-bold uppercase text-grass">Lunch · 11:50 – 12:30</td></tr>
                )}
                <tr>
                  <td className="pr-2 align-middle">
                    <div className="font-display font-semibold">Period {p.n}</div>
                    <div className="text-xs text-ink/50">{p.time}</div>
                  </td>
                  {DAYS.map((_, i) => {
                    const t = slot(i + 1, p.n);
                    const s = t && subject(t.subjectId);
                    if (editing)
                      return (
                        <td key={i}>
                          <select name={`slot_${i + 1}_${p.n}`} defaultValue={t?.subjectId ?? ""} className="input px-2 py-1.5 text-sm">
                            <option value="">–</option>
                            {db.subjects.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                          </select>
                        </td>
                      );
                    return (
                      <td key={i} className="h-14 rounded-xl px-2 text-center font-semibold" style={s ? { background: `${s.color}1f`, color: s.color } : undefined}>
                        {s ? <>{s.emoji} {s.name}</> : <span className="text-ink/30">–</span>}
                      </td>
                    );
                  })}
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
        {editing && (
          <div className="mt-4 flex gap-3">
            <SubmitButton className="btn-grass">Save timetable</SubmitButton>
            <Link href={`/portal/timetable?class=${classId}`} className="btn-ghost">Cancel</Link>
          </div>
        )}
      </form>
    </div>
  );
}
