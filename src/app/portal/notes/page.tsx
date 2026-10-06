import Link from "next/link";
import { ClassSubjectFields } from "@/components/ClassSubjectFields";
import { SubmitButton } from "@/components/SubmitButton";
import { Empty, PageHeader, SubjectChip } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { classIdsFor, lookups, subjectsFor } from "@/lib/scope";
import { createNote, deleteNote } from "../actions";

export const metadata = { title: "Notes" };

export default async function NotesPage({ searchParams }: PageProps<"/portal/notes">) {
  const user = await requireUser("teacher", "student");
  const db = await getDB();
  const { subject: subjectFilter } = await searchParams;
  const { subject, klass, user: who } = lookups(db);
  const classIds = classIdsFor(user, db);
  const isTeacher = user.role === "teacher";
  const notes = db.notes
    .filter((n) => classIds.includes(n.classId) && (!isTeacher || n.teacherId === user.id))
    .filter((n) => !subjectFilter || n.subjectId === subjectFilter)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const usedSubjects = db.subjects.filter((s) => db.notes.some((n) => n.subjectId === s.id && classIds.includes(n.classId)));

  return (
    <div>
      <PageHeader emoji="📒" title={isTeacher ? "Notes & materials" : "My notes"} text={isTeacher ? "Share lesson notes, worksheets and files with your classes." : "Everything your teachers have shared with you."} />

      {isTeacher && (
        <details id="new" className="card mb-8 open:bg-sun-soft/40" open={notes.length === 0}>
          <summary className="cursor-pointer font-display text-xl font-semibold">📤 Upload new notes</summary>
          <form action={createNote} className="mt-5 space-y-4">
            <div>
              <label className="label" htmlFor="title">Title</label>
              <input id="title" name="title" required className="input" placeholder="e.g. Fractions are slices of pizza" />
            </div>
            <ClassSubjectFields classes={db.classes.filter((c) => classIds.includes(c.id))} subjects={subjectsFor(user, db)} />
            <div>
              <label className="label" htmlFor="body">Notes</label>
              <textarea id="body" name="body" rows={6} className="input" placeholder="Write your lesson notes here…" />
            </div>
            <div>
              <label className="label" htmlFor="file">Attach a file (PDF, Word, slides, picture)</label>
              <input id="file" name="file" type="file" className="input file:mr-3 file:rounded-full file:border-0 file:bg-sky file:px-4 file:py-1 file:font-semibold file:text-white" />
            </div>
            <SubmitButton pendingText="Uploading…">Share with class 🚀</SubmitButton>
          </form>
        </details>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/portal/notes" className={`chip text-sm ${!subjectFilter ? "bg-ink text-white" : "bg-white ring-2 ring-ink/10"}`}>All subjects</Link>
        {usedSubjects.map((s) => (
          <Link
            key={s.id}
            href={`/portal/notes?subject=${s.id}`}
            className="chip text-sm"
            style={subjectFilter === s.id ? { background: s.color, color: "white" } : { background: `${s.color}1f`, color: s.color }}
          >
            {s.emoji} {s.name}
          </Link>
        ))}
      </div>

      {notes.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {notes.map((n) => {
            const s = subject(n.subjectId);
            return (
              <div key={n.id} className="card flex flex-col overflow-hidden p-0">
                <div className="h-2" style={{ background: s?.color }} />
                <Link href={`/portal/notes/${n.id}`} className="group flex flex-1 flex-col gap-2 p-5">
                  <div className="flex items-center justify-between">
                    <SubjectChip subject={s} />
                    <span className="text-3xl transition group-hover:scale-125">{s?.emoji}</span>
                  </div>
                  <h3 className="text-xl font-semibold group-hover:text-sky">{n.title}</h3>
                  <p className="line-clamp-3 text-sm text-ink/60">{n.body}</p>
                  {n.fileName && <span className="chip mt-1 w-fit bg-sky-soft text-sky">📎 {n.fileName}</span>}
                </Link>
                <div className="flex items-center justify-between border-t-2 border-ink/5 px-5 py-3 text-xs text-ink/50">
                  <span>{isTeacher ? klass(n.classId)?.name : who(n.teacherId)?.name} · {formatDate(n.createdAt)}</span>
                  {isTeacher && (
                    <form action={deleteNote.bind(null, n.id)}>
                      <button className="font-semibold text-coral hover:underline">Delete</button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Empty emoji="📭" text="No notes here yet." />
      )}
    </div>
  );
}
