"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  if (sent)
    return (
      <div className="card self-start text-center">
        <div className="text-6xl">💌</div>
        <h3 className="mt-2 text-2xl font-semibold">Thank you!</h3>
        <p className="text-ink/70">We&apos;ll get back to you within two school days.</p>
      </div>
    );
  return (
    <form
      className="card relative space-y-4 self-start pt-8"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <span className="tape" aria-hidden />
      <h2 className="text-3xl">Send us a note ✉️</h2>
      <div>
        <label className="label" htmlFor="name">Your name</label>
        <input id="name" required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="email">Email or phone</label>
        <input id="email" required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="topic">I&apos;m asking about</label>
        <select id="topic" className="input">
          <option>Admissions</option>
          <option>After-school clubs</option>
          <option>School fees</option>
          <option>Visiting the school</option>
          <option>Something else</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="msg">Message</label>
        <textarea id="msg" rows={4} required className="input" />
      </div>
      <button className="btn-primary w-full">Send it like a paper plane ✈️</button>
    </form>
  );
}
