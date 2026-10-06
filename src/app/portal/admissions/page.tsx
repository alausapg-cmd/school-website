import Link from "next/link";
import { SubmitButton } from "@/components/SubmitButton";
import { Empty, PageHeader, Stat } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { formatDate } from "@/lib/format";
import type { ApplicationStatus } from "@/lib/types";
import { updateApplication } from "../actions";

export const metadata = { title: "Admissions" };

const STATUS: Record<ApplicationStatus, { label: string; cls: string }> = {
  pending: { label: "New", cls: "bg-sun-soft text-ink" },
  "exam booked": { label: "Exam booked", cls: "bg-sky-soft text-sky" },
  admitted: { label: "Admitted", cls: "bg-grass-soft text-grass" },
  declined: { label: "Declined", cls: "bg-coral-soft text-coral" },
};
const ORDER: ApplicationStatus[] = ["pending", "exam booked", "admitted", "declined"];

export default async function AdmissionsPage({ searchParams }: PageProps<"/portal/admissions">) {
  await requireUser("admin");
  const db = await getDB();
  const sp = await searchParams;
  const filter = typeof sp.status === "string" && (ORDER as string[]).includes(sp.status) ? (sp.status as ApplicationStatus) : null;
  const apps = db.applications
    .filter((a) => !filter || a.status === filter)
    .sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status) || b.createdAt.localeCompare(a.createdAt));
  const n = (s: ApplicationStatus) => db.applications.filter((a) => a.status === s).length;

  return (
    <div>
      <PageHeader emoji="📝" title="Admissions" text="Applications sent from the website's Apply page.">
        <Link href="/apply" className="btn-ghost" target="_blank">View the Apply page ↗</Link>
      </PageHeader>
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat emoji="📥" value={n("pending")} label="New applications" bg="bg-sun-soft" />
        <Stat emoji="✏️" value={n("exam booked")} label="Booked for exam" bg="bg-sky-soft" />
        <Stat emoji="🎉" value={n("admitted")} label="Admitted" bg="bg-grass-soft" />
        <Stat emoji="📁" value={db.applications.length} label="All applications" bg="bg-grape-soft" />
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/portal/admissions" className={`chip py-2 ${!filter ? "bg-ink text-white" : "bg-white ring-2 ring-ink/10"}`}>All</Link>
        {ORDER.map((s) => (
          <Link key={s} href={`/portal/admissions?status=${encodeURIComponent(s)}`} className={`chip py-2 ${filter === s ? "bg-ink text-white" : "bg-white ring-2 ring-ink/10"}`}>
            {STATUS[s].label} ({n(s)})
          </Link>
        ))}
      </div>
      {apps.length ? (
        <div className="space-y-4">
          {apps.map((a) => (
            <article key={a.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold">{a.childName}</h2>
                  <p className="text-sm text-ink/60">
                    {a.gender}{a.dob ? `, born ${formatDate(a.dob)}` : ""} · For {a.classWanted || "any class"}
                  </p>
                </div>
                <span className={`chip ${STATUS[a.status].cls}`}>{STATUS[a.status].label}</span>
              </div>
              <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                <div><dt className="inline text-ink/50">Parent: </dt><dd className="inline font-semibold">{a.parentName}</dd></div>
                <div><dt className="inline text-ink/50">Phone: </dt><dd className="inline"><a href={`tel:${a.phone}`} className="text-sky underline">{a.phone}</a></dd></div>
                <div><dt className="inline text-ink/50">Email: </dt><dd className="inline">{a.email || "–"}</dd></div>
                <div><dt className="inline text-ink/50">Previous school: </dt><dd className="inline">{a.previousSchool || "–"}</dd></div>
                <div className="sm:col-span-2"><dt className="inline text-ink/50">Address: </dt><dd className="inline">{a.address || "–"}</dd></div>
                <div><dt className="inline text-ink/50">Applied: </dt><dd className="inline">{formatDate(a.createdAt, { day: "numeric", month: "long", year: "numeric" })}</dd></div>
              </dl>
              <form action={updateApplication.bind(null, a.id)} className="mt-4 grid gap-3 rounded-2xl bg-cream p-4 sm:grid-cols-[12rem_1fr_auto] sm:items-end">
                <div>
                  <label className="label">Status</label>
                  <select name="status" defaultValue={a.status} className="input">
                    {ORDER.map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Office note</label>
                  <input name="note" defaultValue={a.note} className="input" placeholder="e.g. Exam on Saturday 9am" />
                </div>
                <SubmitButton className="btn-primary">Save</SubmitButton>
              </form>
              {a.status === "admitted" && (
                <p className="mt-3 text-sm text-ink/60">
                  Ready to enrol? <Link href="/portal/students?new=1" className="font-semibold text-sky underline">Add {a.childName.split(" ")[0]} as a pupil</Link>.
                </p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <Empty emoji="📭" text="No applications here." />
      )}
    </div>
  );
}
