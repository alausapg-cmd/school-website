import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { formatDate, today } from "@/lib/format";
import { school } from "@/lib/school";
import { ContactForm } from "./ContactForm";

export const metadata = { title: "Admissions & contact" };

export default function ContactPage() {
  const now = today();
  return (
    <>
      <PageHero emoji="🎒" title="Admissions & contact" text={`Admission is open into the creche, nursery and every primary class for the ${school.currentSession} session.`} tone="sun" pipSays="We'd love to meet you!" />
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-14 md:grid-cols-2">
        <div className="space-y-6">
          <div className="card bg-sky text-white">
            <h2 className="text-3xl">{school.currentSession} assessment days</h2>
            <p className="mt-1 text-white/85">A relaxed play-and-draw morning for new pupils.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {school.entranceExams.map((d, i) => {
                const past = d < now;
                return (
                  <div key={d} className={`wobbly border-2 p-3 text-center ${i % 2 ? "rotate-1" : "-rotate-1"} ${past ? "border-white/30 bg-white/10 text-white/70" : "border-ink bg-sun text-ink"}`}>
                    <div className="font-display text-xl font-bold">{formatDate(d, { day: "numeric", month: "long" })}</div>
                    <div className="text-xs font-semibold uppercase">{past ? "Held ✓" : formatDate(d, { weekday: "long" })}</div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-sm text-white/90">Missed these dates? Admission is still open. Call the school to book your child&apos;s visit.</p>
          </div>
          <div className="card">
            <h3 className="text-2xl">📞 Call us</h3>
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              {school.phones.map((p) => (
                <li key={p} className="font-display text-xl font-bold">{p}</li>
              ))}
            </ul>
          </div>
          {[
            ["📍", "Address", school.address],
            ["✉️", "Email", school.email],
          ].map(([e, t, v]) => (
            <div key={t} className="card flex items-center gap-4">
              <span className="text-4xl">{e}</span>
              <div className="min-w-0">
                <div className="text-sm font-bold uppercase text-ink/60">{t}</div>
                <div className="break-words font-display text-lg font-bold">{v}</div>
              </div>
            </div>
          ))}
          <div className="lined relative wobbly border-2 border-ink py-5 pl-16 pr-5 shadow-[4px_5px_0_rgb(42_43_51/0.12)]">
            <span className="tape" aria-hidden />
            <h3 className="text-2xl leading-8">How to join us</h3>
            <ol className="mt-1 list-inside list-decimal leading-8 text-ink/90">
              <li>Apply online, or visit the school office for a form.</li>
              <li>Bring your child for a play-and-draw assessment.</li>
              <li>Receive your welcome letter and starter sketchbook!</li>
            </ol>
            <Link href="/apply" className="btn-sun mt-3">📝 Apply online</Link>
          </div>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
