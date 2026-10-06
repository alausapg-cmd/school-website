"use client";

import { useState, useTransition } from "react";
import { Confetti } from "@/components/Confetti";
import { Stars } from "@/components/ui";
import { starsFor } from "@/lib/grades";
import { submitQuiz } from "../../actions";

type Q = { prompt: string; options: string[] };
type Outcome = { score: number; total: number; answers: number[]; correct: number[] };

const COLORS = ["bg-coral", "bg-sky", "bg-sun text-ink!", "bg-grass"];
const SHAPES = ["▲", "◆", "●", "■"];

export function QuizPlayer({ quizId, questions, initial }: { quizId: string; questions: Q[]; initial: Outcome | null }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [outcome, setOutcome] = useState<Outcome | null>(initial);
  const [pending, start] = useTransition();

  if (outcome) {
    const pct = (outcome.score / outcome.total) * 100;
    return (
      <div className="space-y-6">
        {!initial && pct >= 60 && <Confetti />}
        <div className="card bg-sun-soft text-center">
          <div className="text-7xl">{pct >= 90 ? "🏆" : pct >= 60 ? "🎉" : "💪"}</div>
          <h2 className="mt-2 text-4xl font-bold">
            {outcome.score} out of {outcome.total}!
          </h2>
          <div className="mt-2 text-4xl"><Stars count={starsFor(pct)} /></div>
          <p className="mt-2 text-lg text-ink/70">
            {pct >= 90 ? "Amazing! You're a superstar!" : pct >= 60 ? "Great job! Keep it up!" : "Good try! Look at the answers below and you'll get it next time."}
          </p>
        </div>
        <div className="space-y-3">
          {questions.map((q, i) => {
            const right = outcome.answers[i] === outcome.correct[i];
            return (
              <div key={i} className={`card ${right ? "ring-grass/40" : "ring-coral/40"}`}>
                <p className="font-display text-lg font-semibold">{right ? "✅" : "❌"} {q.prompt}</p>
                <p className="mt-1 text-sm">
                  Right answer: <b>{q.options[outcome.correct[i]]}</b>
                  {!right && outcome.answers[i] !== undefined && <span className="text-ink/60"> · You said: {q.options[outcome.answers[i]] ?? "nothing"}</span>}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const q = questions[step];
  const choose = (k: number) => {
    const next = [...answers];
    next[step] = k;
    setAnswers(next);
    if (step < questions.length - 1) setTimeout(() => setStep(step + 1), 250);
  };
  const finished = answers.filter((a) => a !== undefined).length === questions.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-white ring-2 ring-ink/10">
          <div className="h-full rounded-full bg-grass transition-all" style={{ width: `${((step + (answers[step] !== undefined ? 1 : 0)) / questions.length) * 100}%` }} />
        </div>
        <span className="font-display font-semibold">{step + 1}/{questions.length}</span>
      </div>
      <div className="card py-10 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-ink/50">Question {step + 1}</p>
        <h2 className="mx-auto mt-2 max-w-2xl text-3xl font-semibold">{q.prompt}</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {q.options.map((opt, k) =>
          opt ? (
            <button
              key={k}
              onClick={() => choose(k)}
              className={`${COLORS[k]} flex items-center gap-4 rounded-3xl p-5 text-left font-display text-xl font-semibold text-white shadow-[0_6px_0_rgba(0,0,0,0.15)] transition hover:-translate-y-1 active:translate-y-0.5 ${
                answers[step] === k ? "ring-8 ring-ink/30" : answers[step] !== undefined ? "opacity-60" : ""
              }`}
            >
              <span className="text-2xl opacity-80">{SHAPES[k]}</span>
              {opt}
            </button>
          ) : null,
        )}
      </div>
      <div className="flex justify-between">
        <button disabled={step === 0} onClick={() => setStep(step - 1)} className="btn-ghost">← Back</button>
        {step < questions.length - 1 ? (
          <button disabled={answers[step] === undefined} onClick={() => setStep(step + 1)} className="btn-ghost">Next →</button>
        ) : (
          <button
            disabled={!finished || pending}
            onClick={() => start(async () => setOutcome(await submitQuiz(quizId, answers)))}
            className="btn-grass text-lg"
          >
            {pending ? "Checking…" : "Finish! 🏁"}
          </button>
        )}
      </div>
    </div>
  );
}
