import { SubmitButton } from "@/components/SubmitButton";
import { school } from "@/lib/school";
import { Notice, PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { lookups } from "@/lib/scope";
import { createPerson } from "../actions";

export const metadata = { title: "People" };

export default async function PeoplePage({ searchParams }: PageProps<"/portal/people">) {
  await requireUser("admin");
  const db = await getDB();
  const sp = await searchParams;
  const { klass, subject } = lookups(db);
  const teachers = db.users.filter((u) => u.role === "teacher");
  const parents = db.users.filter((u) => u.role === "parent");

  return (
    <div>
      <PageHeader emoji="👥" title="People" text="Teachers, parents and pupils who can log in to the portal." />
      {sp.added && <Notice>✅ Added! They can log in straight away.</Notice>}
      {typeof sp.error === "string" && <Notice tone="coral">{sp.error}</Notice>}

      <details className="card mb-8">
        <summary className="cursor-pointer font-display text-xl font-semibold">➕ Add a person</summary>
        <form action={createPerson} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div><label className="label">Full name</label><input name="name" required className="input" /></div>
            <div><label className="label">Email</label><input name="email" type="email" required className="input" /></div>
            <div><label className="label">Starting password</label><input name="password" defaultValue={school.demoPassword} className="input" /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><label className="label">Phone</label><input name="phone" type="tel" className="input" /></div>
            <div>
              <label className="label">Role</label>
              <select name="role" className="input"><option value="student">Pupil</option><option value="teacher">Teacher</option><option value="parent">Parent</option></select>
            </div>
            <div>
              <label className="label">Class (pupils)</label>
              <select name="classId" className="input">{db.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            </div>
          </div>
          <fieldset>
            <legend className="label">Teaches (teachers)</legend>
            <div className="flex flex-wrap gap-2">
              {db.classes.map((c) => (
                <label key={c.id} className="chip cursor-pointer bg-cream py-2 text-sm ring-2 ring-ink/10"><input type="checkbox" name="classIds" value={c.id} /> {c.name}</label>
              ))}
              {db.subjects.map((s) => (
                <label key={s.id} className="chip cursor-pointer bg-cream py-2 text-sm ring-2 ring-ink/10"><input type="checkbox" name="subjectIds" value={s.id} /> {s.emoji} {s.name}</label>
              ))}
            </div>
          </fieldset>
          <SubmitButton>Add person</SubmitButton>
        </form>
      </details>

      <h2 className="mb-3 text-2xl font-semibold">👩‍🏫 Teachers</h2>
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        {teachers.map((t) => (
          <div key={t.id} className="card flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-grass-soft text-3xl">{t.avatar}</span>
            <div>
              <div className="font-display text-lg font-semibold">{t.name}</div>
              <div className="text-sm text-ink/60">{t.email}</div>
              <div className="text-xs text-ink/60">{t.subjectIds?.map((s) => subject(s)?.emoji).join(" ")} · {t.classIds?.map((c) => klass(c)?.name).join(", ")}</div>
            </div>
          </div>
        ))}
      </div>
      <h2 className="mb-3 text-2xl font-semibold">👪 Parents</h2>
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {parents.map((p) => (
          <div key={p.id} className="card p-4">
            <div className="font-semibold">{p.avatar} {p.name}</div>
            <div className="truncate text-xs text-ink/60">{p.email}{p.phone ? ` · ${p.phone}` : ""}</div>
            <div className="mt-1 text-xs text-ink/60">Children: {db.users.filter((u) => u.parentId === p.id).map((u) => u.name.split(" ")[0]).join(", ") || "none linked"}</div>
          </div>
        ))}
      </div>
      {db.classes.map((c) => (
        <section key={c.id} className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">{c.emoji} {c.name}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {db.users.filter((u) => u.role === "student" && u.classId === c.id).map((s) => (
              <div key={s.id} className="card flex items-center gap-3 p-4">
                <span className="text-3xl">{s.avatar}</span>
                <div className="min-w-0">
                  <div className="truncate font-semibold">{s.name}</div>
                  <div className="truncate text-xs text-ink/60">{s.email}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
