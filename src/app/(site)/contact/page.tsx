import Link from "next/link";
import { Fruit } from "@/components/Jungle";
import { Owl } from "@/components/Owl";
import { PageHero } from "@/components/PageHero";
import { formatDate, today } from "@/lib/format";
import { school } from "@/lib/school";
import { ContactForm } from "./ContactForm";

export const metadata = { title: "Admissions & contact" };

export default function ContactPage() {
  const now = today();
  return (
    <>
      <PageHero emoji="🧭" title="Admissions & contact" kicker="Join the adventure" text={`Admission is open into all classes, nursery to secondary, for the ${school.currentSession} session.`} color="bg-sky" fruit="mango" />
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-2">
        <div className="space-y-5">
          <div className="wood relative rounded-[1.75rem] p-6 shadow-[0_8px_0_#4A2D12]">
            <h2 className="text-2xl font-extrabold">🪵 {school.currentSession} entrance assessments</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {school.entranceExams.map((d, i) => {
                const past = d < now;
                return (
                  <div key={d} className={`rounded-2xl p-3 text-center ${i % 2 ? "rotate-1" : "-rotate-1"} ${past ? "bg-black/20 text-white/70" : "bg-sun text-ink shadow-[0_3px_0_#B87800]"}`}>
                    <div className="font-display text-xl font-extrabold">{formatDate(d, { day: "numeric", month: "long" })}</div>
                    <div className="text-xs font-bold uppercase">{past ? "Held" : formatDate(d, { weekday: "long" })}</div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-sm text-white/90">Missed these dates? Admission is still open. Call us to book a friendly assessment for your child.</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-bold">📞 Call us</h3>
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              {school.phones.map((p) => (
                <li key={p} className="font-display text-lg font-semibold text-sky">{p}</li>
              ))}
            </ul>
          </div>
          {[
            ["📍", "Address", school.address, "lime"],
            ["✉️", "Email", school.email, "berry"],
          ].map(([e, t, v, f]) => (
            <div key={t} className="card flex items-center gap-4">
              <Fruit kind={f} className="h-14 w-14 shrink-0 text-2xl">{e}</Fruit>
              <div className="min-w-0">
                <div className="text-sm font-bold uppercase text-ink/50">{t}</div>
                <div className="break-words font-display text-lg">{v}</div>
              </div>
            </div>
          ))}
          <div className="card relative overflow-hidden bg-grass-soft">
            <Owl className="absolute -bottom-3 -right-2 h-24 w-24 opacity-90" hat={false} />
            <h3 className="text-xl font-bold">How to join us</h3>
            <ol className="mt-2 list-inside list-decimal space-y-1 pr-16 text-ink/80">
              <li>Apply online, or visit the school office for a form.</li>
              <li>Your child joins us for a friendly assessment.</li>
              <li>Receive your admission letter and explorer welcome pack.</li>
            </ol>
            <Link href="/apply" className="btn-sun mt-4">📝 Apply online</Link>
          </div>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
