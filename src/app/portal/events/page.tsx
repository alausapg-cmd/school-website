import { SubmitButton } from "@/components/SubmitButton";
import { PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { formatDate, today } from "@/lib/format";
import { createEvent, deleteEvent } from "../actions";

export const metadata = { title: "Manage events" };

export default async function ManageEvents() {
  await requireUser("admin");
  const events = [...(await getDB()).events].sort((a, b) => b.date.localeCompare(a.date));
  const now = today();
  return (
    <div>
      <PageHeader emoji="🎉" title="Events" text="Events appear on the public website's Events page and home page." />
      <form action={createEvent} className="card mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">➕ Add an event</h2>
        <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
          <div><label className="label">Event name</label><input name="title" required className="input" /></div>
          <div><label className="label">Emoji</label><input name="emoji" defaultValue="🎉" className="input text-center text-xl" /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div><label className="label">Date</label><input name="date" type="date" required defaultValue={now} className="input" /></div>
          <div><label className="label">Time</label><input name="time" className="input" placeholder="10:00am" /></div>
          <div><label className="label">Where</label><input name="location" className="input" placeholder="School hall" /></div>
        </div>
        <div><label className="label">Description</label><textarea name="description" rows={3} className="input" /></div>
        <SubmitButton>Add event 🎉</SubmitButton>
      </form>
      <div className="space-y-3">
        {events.map((e) => (
          <div key={e.id} className={`card flex items-center justify-between gap-4 py-4 ${e.date < now ? "opacity-60" : ""}`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{e.emoji}</span>
              <span>
                <span className="block font-display text-lg font-semibold">{e.title}</span>
                <span className="text-sm text-ink/60">{formatDate(e.date)} · {e.time} · {e.location}{e.date < now ? " · past" : ""}</span>
              </span>
            </div>
            <form action={deleteEvent.bind(null, e.id)}><button className="btn-danger px-4 py-1.5 text-sm">Delete</button></form>
          </div>
        ))}
      </div>
    </div>
  );
}
