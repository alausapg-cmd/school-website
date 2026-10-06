import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Nova } from "@/components/space/Art";
import { formatDate, today } from "@/lib/format";
import { school } from "@/lib/school";
import { ContactForm } from "./ContactForm";

export const metadata = { title: "Admissions & contact" };

const steps = [
  ["3", "Apply", "Apply online, or call or visit the school office for a form."],
  ["2", "Visit", "Your child spends a friendly assessment morning with us."],
  ["1", "Welcome", "Receive your admission letter and explorer welcome pack."],
];

export default function ContactPage() {
  const now = today();
  return (
    <>
      <PageHero emoji="🛰️" kicker="Ground control" title="Admissions & contact" text={`Admission is open into creche, nursery and primary classes for the ${school.currentSession} session.`} color="bg-rocket" />
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <div className="night relative overflow-hidden rounded-[2rem] p-6 sm:p-10">
          <div aria-hidden className="stars absolute inset-0 opacity-70" />
          <Nova className="absolute -bottom-4 right-6 hidden h-40 w-auto rotate-12 md:block" />
          <div className="relative">
            <p className="kicker text-glow">Countdown to joining</p>
            <h2 className="mt-1 text-3xl font-extrabold sm:text-4xl">Three steps to lift-off</h2>
            <ol className="mt-6 grid gap-4 md:max-w-3xl md:grid-cols-3">
              {steps.map(([n, t, d]) => (
                <li key={n} className="rounded-2xl bg-white/8 p-4 ring-1 ring-white/15">
                  <span className="font-mono text-4xl font-bold text-star">{n}</span>
                  <p className="font-display text-xl font-extrabold">{t}</p>
                  <p className="text-sm text-white/80">{d}</p>
                </li>
              ))}
            </ol>
            <Link href="/apply" className="btn-sun mt-6">📝 Apply online · Lift-off!</Link>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2">
        <div className="space-y-4">
          <div className="card">
            <p className="kicker text-coral">Assessment mornings</p>
            <h2 className="mt-1 text-2xl font-extrabold">{school.currentSession} entrance assessments</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {school.entranceExams.map((d) => {
                const past = d < now;
                return (
                  <div key={d} className={`rounded-2xl p-3 text-center ${past ? "bg-ink/5 text-ink/50" : "bg-sun text-ink"}`}>
                    <div className="font-display text-xl font-extrabold">{formatDate(d, { day: "numeric", month: "long" })}</div>
                    <div className="text-xs font-bold uppercase">{past ? "Held ✓" : formatDate(d, { weekday: "long" })}</div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-sm text-ink/70">Missed these dates? Admission is still open. Call us to book your child&apos;s assessment morning.</p>
          </div>
          {[
            ["📞", "Call us", school.phones.join(" · ")],
            ["📍", "Launch pad", school.address],
            ["✉️", "Email", school.email],
            ["🕘", "Office hours", "Monday to Friday, 7:30am to 4:00pm"],
          ].map(([e, t, v]) => (
            <div key={t} className="card flex items-center gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-sky-soft text-3xl">{e}</span>
              <div className="min-w-0">
                <div className="kicker text-ink/50">{t}</div>
                <div className="break-words font-display text-lg font-bold">{v}</div>
              </div>
            </div>
          ))}
        </div>
        <ContactForm />
      </section>
    </>
  );
}
