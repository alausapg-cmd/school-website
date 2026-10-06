import type { DB, User } from "./types";

export function lookups(db: DB) {
  const subject = (id: string) => db.subjects.find((s) => s.id === id);
  const klass = (id: string) => db.classes.find((c) => c.id === id);
  const user = (id: string) => db.users.find((u) => u.id === id);
  return { subject, klass, user };
}

// Class ids this user can see.
export function classIdsFor(user: User, db: DB) {
  if (user.role === "student") return user.classId ? [user.classId] : [];
  if (user.role === "parent") return [...new Set(childrenOf(db, user).map((c) => c.classId!))];
  if (user.role === "teacher") return user.classIds ?? [];
  return db.classes.map((c) => c.id);
}

export function subjectsFor(user: User, db: DB) {
  if (user.role === "teacher") return db.subjects.filter((s) => user.subjectIds?.includes(s.id));
  return db.subjects;
}

export function studentsIn(db: DB, classId: string) {
  return db.users.filter((u) => u.role === "student" && u.classId === classId).sort((a, b) => a.name.localeCompare(b.name));
}

export function childrenOf(db: DB, parent: User) {
  return db.users.filter((u) => u.role === "student" && u.parentId === parent.id);
}

// Who may open a pupil's record: admin, their class teachers, their parent, or the pupil.
export function canViewStudent(user: User, student: User) {
  if (user.role === "admin") return true;
  if (user.role === "teacher") return !!student.classId && !!user.classIds?.includes(student.classId);
  if (user.role === "parent") return student.parentId === user.id;
  return user.id === student.id;
}

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
export const PERIODS = [
  { n: 1, time: "8:00 – 8:40" },
  { n: 2, time: "8:40 – 9:20" },
  { n: 3, time: "9:20 – 10:00" },
  { n: 4, time: "10:30 – 11:10" },
  { n: 5, time: "11:10 – 11:50" },
  { n: 6, time: "12:30 – 1:10" },
];

const SEES: Record<User["role"], string[]> = {
  admin: ["everyone", "staff", "parents", "students"],
  teacher: ["everyone", "staff", "students", "parents"],
  parent: ["everyone", "parents"],
  student: ["everyone", "students"],
};

// Notices this user may read, pinned first then newest.
export function noticesFor(db: DB, user: User) {
  return db.notices
    .filter((n) => SEES[user.role].includes(n.audience))
    .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.date.localeCompare(a.date));
}
