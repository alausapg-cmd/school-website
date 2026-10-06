"use client";

import { useActionState, useRef } from "react";
import { login } from "./actions";

const demo = [
  { label: "Pupil", who: "Zainab, Primary 4", email: "student@sunshine.test", emoji: "🦊", cls: "bg-sun-soft" },
  { label: "Teacher", who: "Mrs Okafor", email: "teacher@sunshine.test", emoji: "🌻", cls: "bg-grass-soft" },
  { label: "Admin", who: "Head Teacher", email: "admin@sunshine.test", emoji: "👑", cls: "bg-grape-soft" },
];

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  const form = useRef<HTMLFormElement>(null);

  function quick(email: string) {
    const f = form.current!;
    (f.elements.namedItem("email") as HTMLInputElement).value = email;
    (f.elements.namedItem("password") as HTMLInputElement).value = "sunshine";
    f.requestSubmit();
  }

  return (
    <div className="space-y-6">
      <form ref={form} action={action} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="input" placeholder="you@sunshine.test" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required className="input" />
        </div>
        {error && <p className="rounded-2xl bg-coral-soft px-4 py-2 text-sm font-semibold text-coral">{error}</p>}
        <button disabled={pending} className="btn-primary w-full text-lg">
          {pending ? "Opening…" : "Let's go! 🚀"}
        </button>
      </form>
      <div>
        <p className="mb-2 text-center text-sm font-semibold text-ink/60">Try a demo account (password: sunshine)</p>
        <div className="grid grid-cols-3 gap-2">
          {demo.map((d) => (
            <button
              key={d.email}
              type="button"
              disabled={pending}
              onClick={() => quick(d.email)}
              className={`rounded-2xl ${d.cls} p-3 text-center transition hover:-translate-y-0.5`}
            >
              <div className="text-3xl">{d.emoji}</div>
              <div className="font-display font-semibold">{d.label}</div>
              <div className="text-xs text-ink/60">{d.who}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
