import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Nova } from "@/components/space/Art";
import { SubmitButton } from "@/components/SubmitButton";
import { school } from "@/lib/school";
import { submitApplication } from "../../apply-action";

export const metadata = { title: "Apply for admission" };

const CLASSES = [
  "Creche / Playgroup", "Nursery 1", "Nursery 2", "Reception",
  "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6",
];

export default async function ApplyPage({ searchParams }: PageProps<"/apply">) {
  const sp = await searchParams;
  return (
    <>
      <PageHero emoji="🧑‍🚀" kicker="Crew application" title="Join the crew" text={`Fill in this form and the school office will call you to book your child's assessment morning for the ${school.currentSession} session.`} color="bg-sun" />
      <section className="mx-auto max-w-3xl px-4 py-12">
        {sp.sent ? (
          <div className="card text-center">
            <Nova className="mx-auto h-40 w-auto animate-bob" title="Nova celebrates" />
            <h2 className="mt-2 text-3xl font-extrabold">Application received! 🎉</h2>
            <p className="mx-auto mt-2 max-w-md text-ink/70">
              Thank you. The admissions office will call you on the phone number you gave. You can also reach us on {school.phones[0]}.
            </p>
            <Link href="/" className="btn-primary mt-6">Back to the home page</Link>
          </div>
        ) : (
          <form action={submitApplication} className="card relative space-y-6 border-t-8 border-sky">
            <div className="flex items-center gap-4 rounded-2xl bg-sky-soft p-4">
              <Nova className="h-20 w-auto shrink-0" flame={false} />
              <p className="text-sm text-ink/80"><b className="font-display text-base text-sky">Hi, I&apos;m Nova!</b> This takes about three minutes. Fields marked * are the only ones we really need.</p>
            </div>
            {sp.error && <p className="rounded-2xl bg-coral-soft px-4 py-3 font-semibold text-coral">Please fill in the child&apos;s name, your name and your phone number.</p>}
            <fieldset className="space-y-4">
              <legend className="mb-2 font-display text-2xl font-extrabold">🧒🏾 Your young explorer</legend>
              <div><label className="label" htmlFor="childName">Child&apos;s full name *</label><input id="childName" name="childName" required className="input" /></div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="label" htmlFor="gender">Gender</label>
                  <select id="gender" name="gender" className="input"><option>Female</option><option>Male</option></select>
                </div>
                <div><label className="label" htmlFor="dob">Date of birth</label><input id="dob" name="dob" type="date" className="input" /></div>
                <div>
                  <label className="label" htmlFor="classWanted">Class applying for</label>
                  <select id="classWanted" name="classWanted" className="input">{CLASSES.map((c) => <option key={c}>{c}</option>)}</select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="boarding">Day plan</label>
                  <select id="boarding" name="boarding" className="input"><option value="no">Standard day (to 2:30pm)</option><option value="yes">Extended day (to 5:30pm)</option></select>
                </div>
                <div><label className="label" htmlFor="previousSchool">Previous school (if any)</label><input id="previousSchool" name="previousSchool" className="input" /></div>
              </div>
            </fieldset>
            <fieldset className="space-y-4">
              <legend className="mb-2 font-display text-2xl font-extrabold">👪 Parent or guardian</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label" htmlFor="parentName">Your full name *</label><input id="parentName" name="parentName" required className="input" /></div>
                <div><label className="label" htmlFor="phone">Phone number *</label><input id="phone" name="phone" type="tel" required className="input" placeholder="080..." /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" className="input" /></div>
                <div><label className="label" htmlFor="address">Home address</label><input id="address" name="address" className="input" /></div>
              </div>
            </fieldset>
            <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <SubmitButton className="btn-sun text-lg">Launch my application 🚀</SubmitButton>
            <p className="text-sm text-ink/60">Prefer to apply in person? Visit us at {school.shortAddress} or call {school.phones.slice(0, 2).join(" or ")}.</p>
          </form>
        )}
      </section>
    </>
  );
}
