import { SubmitButton } from "@/components/SubmitButton";
import { Notice, PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { addClass, addSubject, saveSettings } from "../actions";

export const metadata = { title: "Settings" };

export default async function SettingsPage({ searchParams }: PageProps<"/portal/settings">) {
  await requireUser("admin");
  const db = await getDB();
  const sp = await searchParams;
  const s = db.settings;

  return (
    <div className="space-y-8">
      <PageHeader emoji="⚙️" title="School settings" text="The current term and session are used for fees, results, report cards and attendance." />
      {sp.saved && <Notice>✅ Settings saved.</Notice>}

      <form action={saveSettings} className="card space-y-4">
        <h2 className="text-2xl font-semibold">📆 Term and session</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Current term</label>
            <select name="term" defaultValue={s.term} className="input">
              {["First Term", "Second Term", "Third Term"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Session</label>
            <input name="session" defaultValue={s.session} pattern="\d{4}/\d{4}" className="input" placeholder="2026/2027" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div><label className="label">Term starts</label><input type="date" name="termStarts" defaultValue={s.termStarts} className="input" /></div>
          <div><label className="label">Term ends</label><input type="date" name="termEnds" defaultValue={s.termEnds} className="input" /></div>
          <div><label className="label">Next term begins</label><input type="date" name="nextTermBegins" defaultValue={s.nextTermBegins} className="input" /></div>
        </div>
        <SubmitButton>Save settings</SubmitButton>
      </form>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h2 className="text-2xl font-semibold">🏫 Classes</h2>
          <ul className="my-4 flex flex-wrap gap-2">
            {db.classes.map((c) => (
              <li key={c.id} className="chip bg-sky-soft py-2 text-sky">
                {c.emoji} {c.name} · {db.users.filter((u) => u.role === "student" && u.classId === c.id).length} pupils
              </li>
            ))}
          </ul>
          <form action={addClass} className="flex flex-wrap items-end gap-3">
            <div className="flex-1"><label className="label">New class name</label><input name="name" required className="input" placeholder="e.g. JSS 1 Wisdom" /></div>
            <div className="w-20"><label className="label">Emoji</label><input name="emoji" className="input" placeholder="📘" /></div>
            <SubmitButton className="btn-grass">Add class</SubmitButton>
          </form>
        </section>
        <section className="card">
          <h2 className="text-2xl font-semibold">📚 Subjects</h2>
          <ul className="my-4 flex flex-wrap gap-2">
            {db.subjects.map((x) => (
              <li key={x.id} className="chip py-2" style={{ background: `${x.color}1f`, color: x.color }}>{x.emoji} {x.name}</li>
            ))}
          </ul>
          <form action={addSubject} className="flex flex-wrap items-end gap-3">
            <div className="flex-1"><label className="label">New subject</label><input name="name" required className="input" placeholder="e.g. Yoruba" /></div>
            <div className="w-20"><label className="label">Emoji</label><input name="emoji" className="input" placeholder="📘" /></div>
            <SubmitButton className="btn-grass">Add subject</SubmitButton>
          </form>
        </section>
      </div>
    </div>
  );
}
