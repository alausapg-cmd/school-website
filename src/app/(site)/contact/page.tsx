import { PageHero } from "@/components/PageHero";
import { school } from "@/lib/school";
import { ContactForm } from "./ContactForm";

export const metadata = { title: "Contact & admissions" };

export default function ContactPage() {
  return (
    <>
      <PageHero emoji="👋" title="Come and say hello" text="Questions about admissions or a school visit? We'd love to hear from you." color="bg-sun text-ink!" />
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-2">
        <div className="space-y-4">
          {[
            ["📍", "Address", school.address],
            ["📞", "Phone", school.phone],
            ["✉️", "Email", school.email],
            ["🕘", "School hours", school.hours],
          ].map(([e, t, v]) => (
            <div key={t} className="card flex items-center gap-4">
              <span className="text-4xl">{e}</span>
              <div>
                <div className="text-sm font-bold uppercase text-ink/50">{t}</div>
                <div className="font-display text-lg">{v}</div>
              </div>
            </div>
          ))}
          <div className="card bg-grass-soft">
            <h3 className="text-xl font-semibold">🎒 Admissions in 3 easy steps</h3>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-ink/80">
              <li>Send us a message or visit the school office.</li>
              <li>Book a fun assessment day for your child.</li>
              <li>Receive your welcome pack and join the family!</li>
            </ol>
          </div>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
