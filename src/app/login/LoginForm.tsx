"use client";

import { useActionState, useRef } from "react";
import { school } from "@/lib/school";
import { login } from "./actions";

const demo = [
  { label: "Pupil", who: "Zainab, Primary 4", email: `student@${school.demoDomain}`, emoji: "🦊", bg: "#FFE98A", tilt: "-rotate-2" },
  { label: "Teacher", who: "Mrs Okafor", email: `teacher@${school.demoDomain}`, emoji: "🌻", bg: "#BDEBC9", tilt: "rotate-1" },
  { label: "Parent", who: "Mrs Bello", email: `parent@${school.demoDomain}`, emoji: "👪", bg: "#BFDBFF", tilt: "-rotate-1" },
  { label: "Admin", who: "Head Teacher", email: `admin@${school.demoDomain}`, emoji: "👑", bg: "#DCCBFF", tilt: "rotate-2" },
];

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  const form = useRef<HTMLFormElement>(null);

  function quick(email: string) {
    const f = form.current!;
    (f.elements.namedItem("email") as HTMLInputElement).value = email;
    (f.elements.namedItem("password") as HTMLInputElement).value = school.demoPassword;
    f.requestSubmit();
  }

  return (
    <div className="space-y-6">
      <form ref={form} action={action} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="input" placeholder={`you@${school.demoDomain}`} />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required className="input" />
        </div>
        {error && <p className="wobbly border-2 border-coral bg-coral-soft px-4 py-2 text-sm font-semibold text-coral">{error}</p>}
        <button disabled={pending} className="btn-primary w-full text-lg">
          {pending ? "Opening…" : "Let's go! ✏️"}
        </button>
      </form>
      <div>
        <p className="mb-3 text-center font-scribble text-2xl text-ink/75">or tap a demo sticky note (password: <b>{school.demoPassword}</b>)</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {demo.map((d) => (
            <button
              key={d.email}
              type="button"
              disabled={pending}
              onClick={() => quick(d.email)}
              style={{ background: d.bg }}
              className={`sticky-note ${d.tilt} p-3! text-center transition hover:rotate-0 hover:-translate-y-0.5`}
            >
              <div className="text-3xl">{d.emoji}</div>
              <div className="font-display text-lg font-bold leading-tight">{d.label}</div>
              <div className="text-xs text-ink/70">{d.who}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
