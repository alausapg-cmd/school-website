import { PageHero } from "@/components/PageHero";
import { formatDate, today } from "@/lib/format";
import { school } from "@/lib/school";
import { ContactForm } from "./ContactForm";

export const metadata = { title: "Admissions & contact" };

export default function ContactPage() {
  const now = today();
  return (
    <>
      <PageHero emoji="🎒" title="Admissions & contact" text={`Admission is in progress into all classes for the ${school.currentSession} session.`} color="bg-sun text-ink!" />
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-2">
        <div className="space-y-4">
          <div className="card bg-sky text-white">
            <h2 className="text-2xl font-bold">{school.currentSession} entrance examination</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {school.entranceExams.map((d) => {
                const past = d < now;
                return (
                  <div key={d} className={`rounded-2xl p-3 text-center ${past ? "bg-white/10 text-white/60" : "bg-sun text-ink"}`}>
                    <div className="font-display text-xl font-bold">{formatDate(d, { day: "numeric", month: "long" })}</div>
                    <div className="text-xs font-semibold uppercase">{past ? "Held" : formatDate(d, { weekday: "long" })}</div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-sm text-white/90">Missed these dates? Admission is still open. Call the school to book your child&apos;s assessment.</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold">📞 Call us</h3>
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              {school.phones.map((p) => (
                <li key={p} className="font-display text-lg">{p}</li>
              ))}
            </ul>
          </div>
          {[
            ["📍", "Address", school.address],
            ["✉️", "Email", school.email],
            ["🌐", "Website", school.website],
          ].map(([e, t, v]) => (
            <div key={t} className="card flex items-center gap-4">
              <span className="text-4xl">{e}</span>
              <div className="min-w-0">
                <div className="text-sm font-bold uppercase text-ink/50">{t}</div>
                <div className="break-words font-display text-lg">{v}</div>
              </div>
            </div>
          ))}
          <div className="card bg-grass-soft">
            <h3 className="text-xl font-semibold">How to join us</h3>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-ink/80">
              <li>Call or visit the school office to collect an admission form.</li>
              <li>Your child sits the entrance examination.</li>
              <li>Receive your admission letter and welcome pack.</li>
            </ol>
          </div>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
