import type { SchoolClass, Subject } from "@/lib/types";

export function ClassSubjectFields({ classes, subjects }: { classes: SchoolClass[]; subjects: Subject[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="label" htmlFor="classId">Class</label>
        <select id="classId" name="classId" className="input" required>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="subjectId">Subject</label>
        <select id="subjectId" name="subjectId" className="input" required>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
