import Link from "next/link";
import { notFound } from "next/navigation";
import { Confetti } from "@/components/Confetti";
import { SubmitButton } from "@/components/SubmitButton";
import { Notice, SubjectChip } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { formatDate, today } from "@/lib/format";
import { classIdsFor, lookups, studentsIn } from "@/lib/scope";
import { gradeSubmission, submitAssignment } from "../../actions";

export default async function AssignmentPage({ params, searchParams }: PageProps<"/portal/assignments/[id]">) {
  const user = await requireUser("teacher", "student");
  const db = await getDB();
  const { id } = await params;
  const { submitted } = await searchParams;
  const a = db.assignments.find((x) => x.id === id && classIdsFor(user, db).includes(x.classId));
  if (!a) notFound();
  const { subject, user: who, klass } = lookups(db);
  const s = subject(a.subjectId);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/portal/assignments" className="font-display font-semibold text-sky">← All assignments</Link>
      <div className="card">
        <div className="flex flex-wrap items-center gap-2">
          <SubjectChip subject={s} />
          <span className="chip bg-sun-soft">📅 Due {formatDate(a.dueDate, { weekday: "long", day: "numeric", month: "long" })}</span>
          <span className="chip bg-grape-soft text-grape">Out of {a.maxScore}</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold">{a.title}</h1>
        <p className="text-sm text-ink/60">Set by {who(a.teacherId)?.name} for {klass(a.classId)?.name}</p>
        <p className="mt-4 whitespace-pre-line text-lg">{a.instructions}</p>
      </div>
      {user.role === "student" ? studentView() : teacherView()}
    </div>
  );

  function studentView() {
    const mine = db.submissions.find((x) => x.assignmentId === a!.id && x.studentId === user.id);
    if (mine?.score !== undefined)
      return (
        <div className="card bg-grass-soft text-center">
          <div className="text-6xl">🏅</div>
          <h2 className="text-3xl font-bold">You got {mine.score} out of {a!.maxScore}!</h2>
          {mine.feedback && <p className="mt-2 text-lg">&ldquo;{mine.feedback}&rdquo;</p>}
          <p className="mt-4 rounded-2xl bg-white/70 p-4 text-left text-sm whitespace-pre-line"><b>Your answer:</b> {mine.text}</p>
        </div>
      );
    return (
      <>
        {submitted && (
          <>
            <Confetti />
            <Notice>🎉 Woohoo! Your work has been handed in.</Notice>
          </>
        )}
        <form action={submitAssignment.bind(null, a!.id)} className="card space-y-4">
          <h2 className="text-2xl font-semibold">{mine ? "✏️ Change your answer" : "📮 Hand in your work"}</h2>
          {a!.dueDate < today() && !mine && <Notice tone="coral">This is late, but you can still hand it in!</Notice>}
          <div>
            <label className="label" htmlFor="text">Your answer</label>
            <textarea id="text" name="text" rows={6} defaultValue={mine?.text} className="input" placeholder="Type your answer here…" />
          </div>
          <div>
            <label className="label" htmlFor="file">Add a photo or file {mine?.fileName && `(currently: ${mine.fileName})`}</label>
            <input id="file" name="file" type="file" className="input file:mr-3 file:rounded-full file:border-0 file:bg-sky file:px-4 file:py-1 file:font-semibold file:text-white" />
          </div>
          <SubmitButton className="btn-grass text-lg" pendingText="Sending…">{mine ? "Update my work" : "Hand it in! 🚀"}</SubmitButton>
        </form>
      </>
    );
  }

  function teacherView() {
    const students = studentsIn(db, a!.classId);
    return (
      <div className="card">
        <h2 className="mb-4 text-2xl font-semibold">📥 Submissions</h2>
        <div className="space-y-4">
          {students.map((st) => {
            const sub = db.submissions.find((x) => x.assignmentId === a!.id && x.studentId === st.id);
            return (
              <div key={st.id} className="rounded-2xl bg-cream p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-display text-lg font-semibold">{st.avatar} {st.name}</div>
                  {sub ? (
                    <span className="chip bg-sky-soft text-sky">Handed in {formatDate(sub.submittedAt, { day: "numeric", month: "short" })}</span>
                  ) : (
                    <span className="chip bg-ink/5 text-ink/50">Not handed in</span>
                  )}
                </div>
                {sub && (
                  <>
                    {sub.text && <p className="mt-2 whitespace-pre-line text-sm">{sub.text}</p>}
                    {sub.fileUrl && <a href={sub.fileUrl} target="_blank" className="chip mt-2 bg-white text-sky ring-2 ring-sky/20">📎 {sub.fileName}</a>}
                    <form action={gradeSubmission.bind(null, sub.id)} className="mt-3 flex flex-wrap items-end gap-2">
                      <div className="w-24">
                        <label className="label text-xs">Score /{a!.maxScore}</label>
                        <input name="score" type="number" min={0} max={a!.maxScore} defaultValue={sub.score} required className="input py-1.5" />
                      </div>
                      <div className="min-w-48 flex-1">
                        <label className="label text-xs">Feedback</label>
                        <input name="feedback" defaultValue={sub.feedback} className="input py-1.5" placeholder="Well done! 🌟" />
                      </div>
                      <SubmitButton className="btn-grass py-2">{sub.score !== undefined ? "Update" : "Save mark"}</SubmitButton>
                    </form>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
