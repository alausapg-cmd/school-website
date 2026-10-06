import Link from "next/link";
import { ClassSubjectFields } from "@/components/ClassSubjectFields";
import { SubmitButton } from "@/components/SubmitButton";
import { Empty, PageHeader, SubjectChip } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { formatDate, today } from "@/lib/format";
import { classIdsFor, lookups, studentsIn, subjectsFor } from "@/lib/scope";
import { createAssignment } from "../actions";

export const metadata = { title: "Assignments" };

export default async function AssignmentsPage() {
  const user = await requireUser("teacher", "student");
  const db = await getDB();
  const { subject, klass } = lookups(db);
  const classIds = classIdsFor(user, db);
  const isTeacher = user.role === "teacher";
  const list = db.assignments
    .filter((a) => classIds.includes(a.classId) && (!isTeacher || a.teacherId === user.id))
    .sort((a, b) => b.dueDate.localeCompare(a.dueDate));

  return (
    <div>
      <PageHeader emoji="✍️" title={isTeacher ? "Assignments" : "My homework"} text={isTeacher ? "Set work, collect submissions and give feedback." : "Hand in your work and see what your teacher said."} />

      {isTeacher && (
        <details id="new" className="card mb-8 open:bg-coral-soft/30">
          <summary className="cursor-pointer font-display text-xl font-semibold">➕ Set a new assignment</summary>
          <form action={createAssignment} className="mt-5 space-y-4">
            <div>
              <label className="label" htmlFor="title">Title</label>
              <input id="title" name="title" required className="input" placeholder="e.g. Grow a bean in a jar" />
            </div>
            <ClassSubjectFields classes={db.classes.filter((c) => classIds.includes(c.id))} subjects={subjectsFor(user, db)} />
            <div>
              <label className="label" htmlFor="instructions">Instructions</label>
              <textarea id="instructions" name="instructions" rows={4} required className="input" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="dueDate">Due date</label>
                <input id="dueDate" name="dueDate" type="date" required defaultValue={today()} className="input" />
              </div>
              <div>
                <label className="label" htmlFor="maxScore">Marks out of</label>
                <input id="maxScore" name="maxScore" type="number" min={1} defaultValue={10} className="input" />
              </div>
            </div>
            <SubmitButton>Set assignment ✍️</SubmitButton>
          </form>
        </details>
      )}

      {list.length ? (
        <div className="space-y-4">
          {list.map((a) => {
            const subs = db.submissions.filter((s) => s.assignmentId === a.id);
            const mine = subs.find((s) => s.studentId === user.id);
            const late = a.dueDate < today();
            let badge: { text: string; cls: string };
            if (isTeacher) {
              const toMark = subs.filter((s) => s.score === undefined).length;
              badge = { text: `${subs.length}/${studentsIn(db, a.classId).length} handed in${toMark ? ` · ${toMark} to mark` : ""}`, cls: toMark ? "bg-coral-soft text-coral" : "bg-grass-soft text-grass" };
            } else if (mine?.score !== undefined) badge = { text: `Marked: ${mine.score}/${a.maxScore} 🌟`, cls: "bg-grass-soft text-grass" };
            else if (mine) badge = { text: "Handed in ✓", cls: "bg-sky-soft text-sky" };
            else badge = late ? { text: "Late! Hand in now", cls: "bg-coral-soft text-coral" } : { text: "To do", cls: "bg-sun-soft" };
            return (
              <Link key={a.id} href={`/portal/assignments/${a.id}`} className="card flex flex-wrap items-center justify-between gap-4 transition hover:-translate-y-0.5">
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl text-3xl" style={{ background: `${subject(a.subjectId)?.color}1f` }}>
                    {subject(a.subjectId)?.emoji}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold">{a.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-ink/60">
                      <SubjectChip subject={subject(a.subjectId)} />
                      {isTeacher && <span>{klass(a.classId)?.name}</span>}
                      <span>📅 Due {formatDate(a.dueDate)}</span>
                    </div>
                  </div>
                </div>
                <span className={`chip text-sm ${badge.cls}`}>{badge.text}</span>
              </Link>
            );
          })}
        </div>
      ) : (
        <Empty emoji="🎈" text="No homework missions yet." />
      )}
    </div>
  );
}
