import Link from "next/link";
import { notFound } from "next/navigation";
import { Stars, SubjectChip } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { starsFor } from "@/lib/grades";
import { classIdsFor, lookups, studentsIn } from "@/lib/scope";
import { QuizPlayer } from "./QuizPlayer";

export default async function QuizPage({ params }: PageProps<"/portal/quizzes/[id]">) {
  const user = await requireUser("teacher", "student");
  const db = await getDB();
  const { id } = await params;
  const quiz = db.quizzes.find((q) => q.id === id && classIdsFor(user, db).includes(q.classId));
  if (!quiz) notFound();
  const { subject, klass } = lookups(db);

  const header = (
    <div className="mb-6">
      <Link href="/portal/quizzes" className="font-display font-semibold text-sky">← All quizzes</Link>
      <div className="mt-3"><SubjectChip subject={subject(quiz.subjectId)} /></div>
      <h1 className="mt-2 text-4xl font-bold">{quiz.title}</h1>
      <p className="text-ink/60">{quiz.description}</p>
    </div>
  );

  if (user.role === "student") {
    const attempt = db.attempts.find((a) => a.quizId === quiz.id && a.studentId === user.id);
    return (
      <div className="mx-auto max-w-3xl">
        {header}
        <QuizPlayer
          quizId={quiz.id}
          // Only send prompts and options to the browser, never the answers.
          questions={quiz.questions.map(({ prompt, options }) => ({ prompt, options }))}
          initial={attempt ? { score: attempt.score, total: attempt.total, answers: attempt.answers, correct: quiz.questions.map((q) => q.answer) } : null}
        />
      </div>
    );
  }

  const students = studentsIn(db, quiz.classId);
  const attempts = db.attempts.filter((a) => a.quizId === quiz.id);
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {header}
      <div className="card">
        <h2 className="mb-4 text-2xl font-semibold">📊 Scores for {klass(quiz.classId)?.name}</h2>
        <table className="w-full text-left">
          <thead className="text-sm text-ink/50">
            <tr><th className="py-2">Pupil</th><th>Score</th><th>Stars</th></tr>
          </thead>
          <tbody className="divide-y-2 divide-ink/5">
            {students.map((s) => {
              const a = attempts.find((x) => x.studentId === s.id);
              return (
                <tr key={s.id}>
                  <td className="py-2.5 font-semibold">{s.avatar} {s.name}</td>
                  <td>{a ? `${a.score}/${a.total}` : <span className="text-ink/40">Not taken</span>}</td>
                  <td>{a && <Stars count={starsFor((a.score / a.total) * 100)} />}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="card">
        <h2 className="mb-4 text-2xl font-semibold">❓ Questions</h2>
        <ol className="space-y-4">
          {quiz.questions.map((q, i) => {
            const right = attempts.filter((a) => a.answers[i] === q.answer).length;
            return (
              <li key={i} className="rounded-2xl bg-cream p-4">
                <div className="flex flex-wrap justify-between gap-2">
                  <p className="font-display font-semibold">{i + 1}. {q.prompt}</p>
                  {attempts.length > 0 && <span className="chip bg-grass-soft text-grass">{Math.round((right / attempts.length) * 100)}% got it right</span>}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {q.options.filter(Boolean).map((o, k) => (
                    <span key={k} className={`chip text-sm ${k === q.answer ? "bg-grass text-white" : "bg-white ring-2 ring-ink/10"}`}>{o}</span>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
