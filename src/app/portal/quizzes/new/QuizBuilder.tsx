"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Question, SchoolClass, Subject } from "@/lib/types";
import { createQuiz } from "../../actions";

const blank = (): Question => ({ prompt: "", options: ["", "", "", ""], answer: 0 });
const LETTERS = ["A", "B", "C", "D"];

export function QuizBuilder({ classes, subjects }: { classes: SchoolClass[]; subjects: Subject[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [questions, setQuestions] = useState<Question[]>([blank()]);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const update = (i: number, q: Partial<Question>) => setQuestions((qs) => qs.map((x, j) => (j === i ? { ...x, ...q } : x)));

  function save() {
    setError(null);
    start(async () => {
      const res = await createQuiz({ title, description, classId, subjectId, questions });
      if ("error" in res && res.error) setError(res.error);
      else router.push(`/portal/quizzes/${res.id}`);
    });
  }

  return (
    <div className="space-y-6">
      <div className="card space-y-4">
        <div>
          <label className="label" htmlFor="qt">Quiz title</label>
          <input id="qt" value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="e.g. Times tables challenge" />
        </div>
        <div>
          <label className="label" htmlFor="qd">Short description</label>
          <input id="qd" value={description} onChange={(e) => setDescription(e.target.value)} className="input" placeholder="What is this quiz about?" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="qc">Class</label>
            <select id="qc" value={classId} onChange={(e) => setClassId(e.target.value)} className="input">
              {classes.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="qs">Subject</label>
            <select id="qs" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="input">
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {questions.map((q, i) => (
        <div key={i} className="card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Question {i + 1}</h3>
            {questions.length > 1 && (
              <button type="button" onClick={() => setQuestions((qs) => qs.filter((_, j) => j !== i))} className="text-sm font-semibold text-coral">
                Remove
              </button>
            )}
          </div>
          <input value={q.prompt} onChange={(e) => update(i, { prompt: e.target.value })} className="input" placeholder="Type the question…" />
          <p className="text-sm text-ink/60">Fill in the answers and tap the circle next to the right one.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {q.options.map((opt, k) => (
              <div key={k} className={`flex items-center gap-2 rounded-2xl p-1.5 ${q.answer === k ? "bg-grass-soft" : "bg-cream"}`}>
                <button
                  type="button"
                  onClick={() => update(i, { answer: k })}
                  aria-label={`Mark ${LETTERS[k]} as correct`}
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display font-bold ${q.answer === k ? "bg-grass text-white" : "bg-white ring-2 ring-ink/10"}`}
                >
                  {q.answer === k ? "✓" : LETTERS[k]}
                </button>
                <input
                  value={opt}
                  onChange={(e) => update(i, { options: q.options.map((o, m) => (m === k ? e.target.value : o)) })}
                  className="input py-1.5"
                  placeholder={`Answer ${LETTERS[k]}`}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setQuestions((qs) => [...qs, blank()])} className="btn-ghost">➕ Add question</button>
        <button type="button" disabled={pending} onClick={save} className="btn-primary">{pending ? "Saving…" : "Publish quiz 🚀"}</button>
      </div>
      {error && <p className="rounded-2xl bg-coral-soft px-4 py-2 font-semibold text-coral">{error}</p>}
    </div>
  );
}
