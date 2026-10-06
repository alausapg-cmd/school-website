import { PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { classIdsFor, subjectsFor } from "@/lib/scope";
import { QuizBuilder } from "./QuizBuilder";

export const metadata = { title: "New quiz" };

export default async function NewQuizPage() {
  const user = await requireUser("teacher");
  const db = await getDB();
  const classIds = classIdsFor(user, db);
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader emoji="🧠" title="Build a quiz" text="Multiple-choice questions are marked automatically." />
      <QuizBuilder classes={db.classes.filter((c) => classIds.includes(c.id))} subjects={subjectsFor(user, db)} />
    </div>
  );
}
