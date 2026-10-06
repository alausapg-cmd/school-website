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
