import { SubmitButton } from "@/components/SubmitButton";
import { Empty, PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { lookups, noticesFor } from "@/lib/scope";
import type { Audience } from "@/lib/types";
import { createNotice, deleteNotice } from "../actions";

export const metadata = { title: "Notice board" };

const AUDIENCE: Record<Audience, { label: string; cls: string }> = {
  everyone: { label: "Everyone", cls: "bg-sky-soft text-sky" },
  staff: { label: "Staff only", cls: "bg-grape-soft text-grape" },
  parents: { label: "Parents", cls: "bg-sun-soft text-ink" },
  students: { label: "Pupils", cls: "bg-grass-soft text-grass" },
};

export default async function NoticesPage() {
  const user = await requireUser();
  const db = await getDB();
  const { user: who } = lookups(db);
  const notices = noticesFor(db, user);
  const canPost = user.role === "admin" || user.role === "teacher";
  const audiences: Audience[] = user.role === "admin" ? ["everyone", "parents", "students", "staff"] : ["students", "parents", "everyone"];

  return (
    <div>
      <PageHeader emoji="📢" title="Notice board" text="Announcements from the school to parents, pupils and staff." />
      {canPost && (
        <details className="card mb-8" id="new">
          <summary className="cursor-pointer font-display text-xl font-semibold">➕ Post a notice</summary>
          <form action={createNotice} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2"><label className="label">Title</label><input name="title" required className="input" placeholder="e.g. Mid-term break" /></div>
              <div>
                <label className="label">Who should see it?</label>
                <select name="audience" className="input">
                  {audiences.map((a) => <option key={a} value={a}>{AUDIENCE[a].label}</option>)}
                </select>
              </div>
            </div>
            <div><label className="label">Message</label><textarea name="body" required rows={4} className="input" /></div>
            {user.role === "admin" && (
              <label className="flex items-center gap-2 font-semibold"><input type="checkbox" name="pinned" value="yes" /> 📌 Pin to the top</label>
            )}
            <SubmitButton>Post notice</SubmitButton>
          </form>
        </details>
      )}
      {notices.length ? (
        <div className="space-y-4">
          {notices.map((n) => {
            const a = AUDIENCE[n.audience];
            const mine = user.role === "admin" || n.authorId === user.id;
            return (
              <article key={n.id} className={`card ${n.pinned ? "ring-4 ring-sun" : ""}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xl font-semibold">{n.pinned ? "📌 " : ""}{n.title}</h2>
                  <span className={`chip text-xs ${a.cls}`}>{a.label}</span>
                </div>
                <p className="mt-2 whitespace-pre-line text-ink/80">{n.body}</p>
                <div className="mt-3 flex items-center justify-between text-sm text-ink/50">
                  <span>{who(n.authorId)?.name ?? "School office"} · {formatDate(n.date, { day: "numeric", month: "long", year: "numeric" })}</span>
                  {canPost && mine && (
                    <form action={deleteNotice.bind(null, n.id)}>
                      <button className="font-semibold text-coral hover:underline">Remove</button>
                    </form>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <Empty emoji="📭" text="No notices yet." />
      )}
    </div>
  );
}
