import Link from "next/link";
import { school } from "@/lib/school";
import { SubmitButton } from "@/components/SubmitButton";
import { Empty, PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { FEE_STATE, feeStatus, naira } from "@/lib/fees";
import { classIdsFor, lookups } from "@/lib/scope";
import { createStudent } from "../actions";

export const metadata = { title: "Students" };

export default async function StudentsPage({ searchParams }: PageProps<"/portal/students">) {
  const user = await requireUser("admin", "teacher");
  const db = await getDB();
  const sp = await searchParams;
  const { klass, user: who } = lookups(db);
  const isAdmin = user.role === "admin";
  const classIds = classIdsFor(user, db);
  const q = typeof sp.q === "string" ? sp.q.toLowerCase() : "";
  const cls = typeof sp.class === "string" && classIds.includes(sp.class) ? sp.class : "";
  const mode = sp.mode === "boarding" || sp.mode === "day" ? sp.mode : "";
  const list = db.users
    .filter((u) => u.role === "student" && classIds.includes(u.classId!))
    .filter((u) => !cls || u.classId === cls)
    .filter((u) => !mode || (mode === "boarding") === !!u.boarding)
    .filter((u) => !q || u.name.toLowerCase().includes(q) || u.admissionNo?.toLowerCase().includes(q))
    .sort((a, b) => (a.classId! + a.name).localeCompare(b.classId! + b.name));
  const parents = db.users.filter((u) => u.role === "parent").sort((a, b) => a.name.localeCompare(b.name));
  const boys = list.filter((s) => s.gender === "Male").length;

  return (
    <div>
      <PageHeader emoji="🧒" title={isAdmin ? "Students" : "My pupils"} text={`${list.length} pupils · ${boys} boys, ${list.length - boys} girls · ${list.filter((s) => s.boarding).length} boarders`} />

      {isAdmin && (
        <details className="card mb-6" open={sp.new === "1"}>
          <summary className="cursor-pointer font-display text-xl font-semibold">➕ Enrol a new pupil</summary>
          <form action={createStudent} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div><label className="label" htmlFor="name">Full name</label><input id="name" name="name" required className="input" /></div>
              <div>
                <label className="label" htmlFor="classId">Class</label>
                <select id="classId" name="classId" className="input">{db.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
              </div>
              <div>
                <label className="label" htmlFor="gender">Gender</label>
                <select id="gender" name="gender" className="input"><option>Female</option><option>Male</option></select>
              </div>
              <div><label className="label" htmlFor="dob">Date of birth</label><input id="dob" name="dob" type="date" className="input" /></div>
              <div>
                <label className="label" htmlFor="boarding">Day or boarding</label>
                <select id="boarding" name="boarding" className="input"><option value="no">Day pupil</option><option value="yes">Boarder</option></select>
              </div>
              <div><label className="label" htmlFor="address">Home address</label><input id="address" name="address" className="input" /></div>
            </div>
            <fieldset className="rounded-2xl bg-cream p-4">
              <legend className="label px-1">Parent or guardian</legend>
              <select name="parentId" className="input mb-3" defaultValue="new">
                <option value="new">➕ New parent (fill in below)</option>
                {parents.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.email}</option>)}
              </select>
              <div className="grid gap-3 sm:grid-cols-3">
                <input name="parentName" className="input" placeholder="Parent's name" />
                <input name="parentPhone" className="input" placeholder="Phone number" />
                <input name="parentEmail" type="email" className="input" placeholder="Email (for portal login)" />
              </div>
            </fieldset>
            <SubmitButton>Enrol pupil</SubmitButton>
            <p className="text-sm text-ink/60">An admission number is given automatically. Pupil and parent can log in with the password <b>{school.demoPassword}</b>.</p>
          </form>
        </details>
      )}

      <form className="mb-6 flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Search name or admission no." className="input max-w-xs py-2" />
        <select name="class" defaultValue={cls} className="input w-auto py-2">
          <option value="">All classes</option>
          {db.classes.filter((c) => classIds.includes(c.id)).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select name="mode" defaultValue={mode} className="input w-auto py-2">
          <option value="">Day & boarding</option>
          <option value="day">Day pupils</option>
          <option value="boarding">Boarders</option>
        </select>
        <button className="btn-ghost py-2">Filter</button>
      </form>

      {list.length ? (
        <div className="card overflow-x-auto p-0">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-cream text-ink/60">
              <tr>
                <th className="px-4 py-3">Pupil</th>
                <th>Admission no.</th>
                <th>Class</th>
                <th>Type</th>
                <th>Parent</th>
                {isAdmin && <th className="pr-4">Fees this term</th>}
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-ink/5">
              {list.map((s) => {
                const f = isAdmin ? feeStatus(db, s) : null;
                const parent = s.parentId ? who(s.parentId) : undefined;
                return (
                  <tr key={s.id} className="hover:bg-sky-soft/40">
                    <td className="px-4 py-3">
                      <Link href={`/portal/students/${s.id}`} className="font-semibold text-sky hover:underline">{s.avatar} {s.name}</Link>
                    </td>
                    <td className="font-mono text-xs">{s.admissionNo}</td>
                    <td>{klass(s.classId!)?.name}</td>
                    <td>{s.boarding ? <span className="chip bg-grape-soft text-grape">🏠 Boarder</span> : <span className="chip bg-ink/5">Day</span>}</td>
                    <td>{parent ? <>{parent.name}<div className="text-xs text-ink/50">{parent.phone}</div></> : "–"}</td>
                    {f && (
                      <td className="pr-4">
                        <span className={`chip ${FEE_STATE[f.state].cls}`}>{FEE_STATE[f.state].label}</span>
                        {f.balance > 0 && <div className="mt-0.5 text-xs text-coral">Owes {naira(f.balance)}</div>}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty emoji="🔍" text="No pupils match." />
      )}
    </div>
  );
}
