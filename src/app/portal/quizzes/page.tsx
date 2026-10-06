import Link from "next/link";
import { Empty, PageHeader, Stars, SubjectChip } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { starsFor } from "@/lib/grades";
import { classIdsFor, lookups, studentsIn } from "@/lib/scope";

export const metadata = { title: "Quizzes" };

export default async function QuizzesPage() {
  const user = await requireUser("teacher", "student");
  const db = await getDB();
  const { subject, klass } = lookups(db);
  const classIds = classIdsFor(user, db);
  const isTeacher = user.role === "teacher";
  const quizzes = db.quizzes
    .filter((q) => classIds.includes(q.classId) && (!isTeacher || q.teacherId === user.id))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <PageHeader emoji="🧠" title={isTeacher ? "Assessments" : "Quizzes"} text={isTeacher ? "Build quick quizzes that mark themselves." : "Test your brain power and collect stars!"}>
        {isTeacher && <Link href="/portal/quizzes/new" className="btn-primary">➕ New quiz</Link>}
      </PageHeader>
      {quizzes.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((q, i) => {
            const s = subject(q.subjectId);
            const attempt = db.attempts.find((a) => a.quizId === q.id && a.studentId === user.id);
            const taken = db.attempts.filter((a) => a.quizId === q.id);
            const avg = taken.length ? Math.round((taken.reduce((t, a) => t + a.score / a.total, 0) / taken.length) * 100) : null;
            return (
              <Link
                key={q.id}
                href={`/portal/quizzes/${q.id}`}
                className={`group relative overflow-hidden rounded-3xl p-6 transition hover:-translate-y-1 hover:rotate-[0.5deg] ${["bg-grape-soft", "bg-sky-soft", "bg-sun-soft", "bg-grass-soft"][i % 4]}`}
              >
                <span className="absolute -right-3 -top-3 text-7xl opacity-30 transition group-hover:scale-110">{s?.emoji}</span>
                <SubjectChip subject={s} />
                <h3 className="mt-3 text-2xl font-semibold">{q.title}</h3>
                <p className="text-sm text-ink/70">{q.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm font-semibold">
                  <span>❓ {q.questions.length} questions</span>
                  {isTeacher ? (
                    <span>{klass(q.classId)?.name.split(" ")[0]} {klass(q.classId)?.name.split(" ")[1]} · {taken.length}/{studentsIn(db, q.classId).length} done{avg !== null ? ` · avg ${avg}%` : ""}</span>
                  ) : attempt ? (
                    <span>{attempt.score}/{attempt.total} <Stars count={starsFor((attempt.score / attempt.total) * 100)} /></span>
                  ) : (
                    <span className="btn-grass px-4 py-1 text-sm">Start ▶</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <Empty emoji="🤔" text="No quizzes in orbit yet." />
      )}
    </div>
  );
}
