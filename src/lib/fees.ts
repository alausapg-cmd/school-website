import type { DB, User } from "./types";

export const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

export function feeLines(db: DB, student: User, term: string, session: string) {
  return db.feeItems.filter(
    (f) => f.term === term && f.session === session && (f.classId === "all" || f.classId === student.classId) && (!f.boardingOnly || student.boarding),
  );
}

export function feeStatus(db: DB, student: User, term = db.settings.term, session = db.settings.session) {
  const lines = feeLines(db, student, term, session);
  const billed = lines.reduce((t, f) => t + f.amount, 0);
  const payments = db.payments.filter((p) => p.studentId === student.id && p.term === term && p.session === session).sort((a, b) => a.date.localeCompare(b.date));
  const paid = payments.reduce((t, p) => t + p.amount, 0);
  const balance = billed - paid;
  const state = billed === 0 ? "none" : balance <= 0 ? "paid" : paid > 0 ? "part" : "owing";
  return { lines, billed, payments, paid, balance, state } as const;
}

export const FEE_STATE = {
  paid: { label: "Fully paid", cls: "bg-grass-soft text-grass" },
  part: { label: "Part paid", cls: "bg-sun-soft text-ink" },
  owing: { label: "Not paid", cls: "bg-coral-soft text-coral" },
  none: { label: "No fees set", cls: "bg-ink/5 text-ink/50" },
} as const;
