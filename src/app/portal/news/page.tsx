import Link from "next/link";
import { SubmitButton } from "@/components/SubmitButton";
import { PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { formatDate, today } from "@/lib/format";
import { createNews, deleteNews } from "../actions";

export const metadata = { title: "Manage news" };

export default async function ManageNews() {
  await requireUser("admin");
  const news = [...(await getDB()).news].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div>
      <PageHeader emoji="📰" title="School news" text="Stories you post here appear on the public website straight away." />
      <form action={createNews} className="card mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">✏️ Write a story</h2>
        <div className="grid gap-4 sm:grid-cols-[1fr_120px_180px]">
          <div><label className="label">Headline</label><input name="title" required className="input" /></div>
          <div><label className="label">Emoji</label><input name="emoji" defaultValue="📣" className="input text-center text-xl" /></div>
          <div><label className="label">Date</label><input name="date" type="date" defaultValue={today()} className="input" /></div>
        </div>
        <div><label className="label">Short summary</label><input name="summary" required className="input" /></div>
        <div><label className="label">Full story</label><textarea name="body" rows={5} required className="input" placeholder="Leave a blank line between paragraphs." /></div>
        <SubmitButton>Publish story 🚀</SubmitButton>
      </form>
      <div className="space-y-3">
        {news.map((n) => (
          <div key={n.id} className="card flex items-center justify-between gap-4 py-4">
            <Link href={`/news/${n.id}`} target="_blank" className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl text-2xl" style={{ background: `${n.color}22` }}>{n.emoji}</span>
              <span>
                <span className="block font-display text-lg font-semibold">{n.title}</span>
                <span className="text-sm text-ink/60">{formatDate(n.date)}</span>
              </span>
            </Link>
            <form action={deleteNews.bind(null, n.id)}><button className="btn-danger px-4 py-1.5 text-sm">Delete</button></form>
          </div>
        ))}
      </div>
    </div>
  );
}
