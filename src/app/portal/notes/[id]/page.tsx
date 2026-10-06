import Link from "next/link";
import { notFound } from "next/navigation";
import { SubjectChip } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { classIdsFor, lookups } from "@/lib/scope";

export default async function NotePage({ params }: PageProps<"/portal/notes/[id]">) {
  const user = await requireUser("teacher", "student");
  const db = await getDB();
  const { id } = await params;
  const note = db.notes.find((n) => n.id === id && classIdsFor(user, db).includes(n.classId));
  if (!note) notFound();
  const { subject, user: who, klass } = lookups(db);
  const s = subject(note.subjectId);
  const isImage = note.fileName && /\.(png|jpe?g|gif)$/i.test(note.fileName);

  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/portal/notes" className="font-display font-semibold text-sky">← All notes</Link>
      <div className="card mt-4 overflow-hidden p-0">
        <div className="flex items-center gap-4 p-6" style={{ background: `${s?.color}1f` }}>
          <span className="text-6xl">{s?.emoji}</span>
          <div>
            <SubjectChip subject={s} />
            <h1 className="mt-1 text-3xl font-bold">{note.title}</h1>
            <p className="text-sm text-ink/60">
              {who(note.teacherId)?.name} · {klass(note.classId)?.name} · {formatDate(note.createdAt)}
            </p>
          </div>
        </div>
        <div className="space-y-6 p-6">
          {note.body && <div className="whitespace-pre-line text-lg leading-relaxed">{note.body}</div>}
          {note.fileUrl && (
            <div className="rounded-2xl bg-sky-soft p-4">
              {isImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={note.fileUrl} alt={note.fileName} className="mb-3 max-h-96 rounded-xl" />
              )}
              <a href={note.fileUrl} target="_blank" className="btn-primary">📎 Open {note.fileName}</a>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
