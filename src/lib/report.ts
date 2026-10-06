import { studentsIn } from "./scope";
import type { DB, User } from "./types";

const avgOf = (db: DB, studentId: string, session: string, term: string) => {
  const rs = db.results.filter((r) => r.studentId === studentId && r.session === session && r.term === term);
  return rs.length ? rs.reduce((s, r) => s + r.ca + r.exam, 0) / rs.length : null;
};

export const ordinal = (n: number) => n + (["th", "st", "nd", "rd"][n % 100 > 10 && n % 100 < 14 ? 0 : n % 10] ?? "th");

// Result periods ("session|term") a pupil has, newest first.
export function periodsFor(db: DB, student: User) {
  const order = ["First Term", "Second Term", "Third Term"];
  return [...new Set(db.results.filter((r) => r.studentId === student.id).map((r) => `${r.session}|${r.term}`))].sort((a, b) => {
    const [sa, ta] = a.split("|"), [sb, tb] = b.split("|");
    return sb.localeCompare(sa) || order.indexOf(tb) - order.indexOf(ta);
  });
}

export function reportFor(db: DB, student: User, period?: string) {
  const periods = periodsFor(db, student);
  const current = period && periods.includes(period) ? period : periods[0];
  if (!current) return { periods, current: undefined } as const;
  const [session, term] = current.split("|");
  const rows = db.results.filter((r) => r.studentId === student.id && r.session === session && r.term === term);
  const avg = avgOf(db, student.id, session, term) ?? 0;
  const ranked = studentsIn(db, student.classId!)
    .map((c) => ({ id: c.id, avg: avgOf(db, c.id, session, term) }))
    .filter((c) => c.avg !== null)
    .sort((a, b) => b.avg! - a.avg!);
  const position = ranked.findIndex((c) => c.id === student.id) + 1;
  return { periods, current, session, term, rows, avg, position, classSize: ranked.length } as const;
}
