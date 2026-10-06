import Link from "next/link";
import { SubmitButton } from "@/components/SubmitButton";
import { Notice, PageHeader, Stat } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { FEE_STATE, feeStatus, naira } from "@/lib/fees";
import { formatDate, today } from "@/lib/format";
import { childrenOf, lookups } from "@/lib/scope";
import type { DB, User } from "@/lib/types";
import { deleteFeeItem, recordPayment, saveFeeItem } from "../actions";

export const metadata = { title: "School fees" };

export default async function FeesPage({ searchParams }: PageProps<"/portal/fees">) {
  const user = await requireUser("admin", "parent");
  const db = await getDB();
  if (user.role === "parent") return <ParentFees user={user} db={db} />;

  const sp = await searchParams;
  const { klass, user: who } = lookups(db);
  const students = db.users.filter((u) => u.role === "student");
  const rows = students.map((s) => ({ s, f: feeStatus(db, s) }));
  const expected = rows.reduce((t, r) => t + r.f.billed, 0);
  const collected = rows.reduce((t, r) => t + r.f.paid, 0);
  const cls = typeof sp.class === "string" ? sp.class : "";
  const debtors = rows.filter((r) => r.f.balance > 0 && (!cls || r.s.classId === cls)).sort((a, b) => b.f.balance - a.f.balance);
  const { term, session } = db.settings;
  const items = db.feeItems.filter((f) => f.term === term && f.session === session);
  const recent = db.payments.filter((p) => p.term === term && p.session === session).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
  const pct = expected ? Math.round((collected / expected) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader emoji="💳" title="Fees & payments" text={`${term}, ${session}`} />
      {typeof sp.error === "string" && <Notice tone="coral">{sp.error}</Notice>}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat emoji="🧾" value={naira(expected)} label="Expected this term" bg="bg-sky-soft" />
        <Stat emoji="✅" value={naira(collected)} label="Collected" bg="bg-grass-soft" />
        <Stat emoji="⏳" value={naira(expected - collected)} label="Outstanding" bg="bg-coral-soft" />
        <Stat emoji="📈" value={`${pct}%`} label={`${rows.filter((r) => r.f.state === "paid").length} of ${rows.length} pupils fully paid`} bg="bg-sun-soft" />
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-white ring-2 ring-ink/10" aria-hidden>
        <div className="h-full rounded-full bg-grass" style={{ width: `${pct}%` }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <form action={recordPayment} className="card space-y-3">
          <h2 className="text-2xl font-semibold">💵 Record a payment</h2>
          <div>
            <label className="label" htmlFor="studentId">Pupil</label>
            <select id="studentId" name="studentId" required className="input">
              <option value="">Choose a pupil…</option>
              {rows
                .sort((a, b) => a.s.name.localeCompare(b.s.name))
                .map(({ s, f }) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({klass(s.classId!)?.name}){f.balance > 0 ? ` · owes ${naira(f.balance)}` : " · paid"}
                  </option>
                ))}
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="label" htmlFor="amount">Amount (₦)</label><input id="amount" name="amount" type="number" min={1} required className="input" /></div>
            <div>
              <label className="label" htmlFor="method">Method</label>
              <select id="method" name="method" className="input"><option>Bank transfer</option><option>Cash</option><option>POS</option><option>Online</option></select>
            </div>
            <div><label className="label" htmlFor="reference">Reference / teller no.</label><input id="reference" name="reference" className="input" /></div>
            <div><label className="label" htmlFor="date">Date</label><input id="date" name="date" type="date" defaultValue={today()} className="input" /></div>
          </div>
          <SubmitButton className="btn-grass">Save & print receipt 🧾</SubmitButton>
        </form>

        <section className="card">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-2xl font-semibold">⏳ Owing ({debtors.length})</h2>
            <form className="flex gap-2">
              <select name="class" defaultValue={cls} className="input w-auto py-1.5 text-sm">
                <option value="">All classes</option>
                {db.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button className="btn-ghost py-1.5 text-sm">Filter</button>
            </form>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="text-ink/50"><tr><th className="py-1 text-left">Pupil</th><th className="text-right">Paid</th><th className="text-right">Balance</th></tr></thead>
              <tbody className="divide-y-2 divide-ink/5">
                {debtors.map(({ s, f }) => (
                  <tr key={s.id}>
                    <td className="py-2">
                      <Link href={`/portal/students/${s.id}`} className="font-semibold text-sky hover:underline">{s.name}</Link>
                      <div className="text-xs text-ink/50">{klass(s.classId!)?.name} · {s.parentId ? who(s.parentId)?.phone : ""}</div>
                    </td>
                    <td className="text-right tabular-nums">{naira(f.paid)}</td>
                    <td className="text-right font-bold tabular-nums text-coral">{naira(f.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {debtors.length === 0 && <p className="py-6 text-center text-ink/60">🎉 Everyone has paid.</p>}
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h2 className="mb-3 text-2xl font-semibold">📋 Fee list for {term}</h2>
          <table className="w-full text-sm">
            <thead className="text-ink/50"><tr><th className="py-1 text-left">Item</th><th className="text-left">For</th><th className="text-right">Amount</th><th /></tr></thead>
            <tbody className="divide-y-2 divide-ink/5">
              {items.map((f) => (
                <tr key={f.id}>
                  <td className="py-2">{f.name}</td>
                  <td>{f.classId === "all" ? "All classes" : klass(f.classId)?.name}{f.boardingOnly ? " · extended day" : ""}</td>
                  <td className="text-right tabular-nums">{naira(f.amount)}</td>
                  <td className="w-16 text-right">
                    <form action={deleteFeeItem.bind(null, f.id)}><button className="text-xs font-semibold text-coral hover:underline">Remove</button></form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <form action={saveFeeItem} className="mt-4 grid gap-2 rounded-2xl bg-cream p-3 sm:grid-cols-2">
            <input name="name" required placeholder="Item, e.g. Excursion" className="input py-2" />
            <input name="amount" type="number" min={0} required placeholder="Amount (₦)" className="input py-2" />
            <select name="classId" className="input py-2">
              <option value="all">All classes</option>
              {db.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select name="boardingOnly" className="input py-2"><option value="no">Everyone</option><option value="yes">Extended day only</option></select>
            <SubmitButton className="btn-ghost sm:col-span-2">➕ Add fee item</SubmitButton>
          </form>
        </section>

        <section className="card">
          <h2 className="mb-3 text-2xl font-semibold">🧾 Recent payments</h2>
          <ul className="divide-y-2 divide-ink/5 text-sm">
            {recent.map((p) => (
              <li key={p.id}>
                <Link href={`/portal/fees/receipt/${p.id}`} className="flex items-center justify-between gap-3 py-2.5 hover:text-sky">
                  <span>
                    <span className="font-semibold">{who(p.studentId)?.name}</span>
                    <span className="block text-xs text-ink/50">{p.receiptNo} · {formatDate(p.date)} · {p.method}</span>
                  </span>
                  <span className="font-bold tabular-nums text-grass">{naira(p.amount)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function ParentFees({ user, db }: { user: User; db: DB }) {
  const kids = childrenOf(db, user);
  const { klass } = lookups(db);
  const total = kids.reduce((t, k) => t + Math.max(0, feeStatus(db, k).balance), 0);
  return (
    <div className="space-y-6">
      <PageHeader emoji="💳" title="School fees" text={`${db.settings.term}, ${db.settings.session}`} />
      <div className={`card ${total > 0 ? "bg-coral-soft" : "bg-grass-soft"}`}>
        <p className="text-sm font-semibold text-ink/60">Total outstanding for your children</p>
        <p className="font-display text-4xl font-bold">{total > 0 ? naira(total) : "All paid 🎉"}</p>
        <p className="mt-2 text-sm text-ink/70">Pay at the school bursary or by bank transfer, then send your proof of payment to the school office. Your receipt will appear here once the bursar records it.</p>
      </div>
      {kids.map((k) => {
        const f = feeStatus(db, k);
        return (
          <section key={k.id} className="card">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-2xl font-semibold">{k.avatar} {k.name} <span className="text-base font-normal text-ink/50">· {klass(k.classId!)?.name}{k.boarding ? " · Extended day" : ""}</span></h2>
              <span className={`chip ${FEE_STATE[f.state].cls}`}>{FEE_STATE[f.state].label}</span>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <table className="w-full text-sm">
                <tbody className="divide-y-2 divide-ink/5">
                  {f.lines.map((l) => <tr key={l.id}><td className="py-1.5">{l.name}</td><td className="text-right tabular-nums">{naira(l.amount)}</td></tr>)}
                  <tr className="font-bold"><td className="py-2">Total</td><td className="text-right tabular-nums">{naira(f.billed)}</td></tr>
                  <tr className={f.balance > 0 ? "font-bold text-coral" : "font-bold text-grass"}><td>Balance</td><td className="text-right tabular-nums">{naira(Math.max(0, f.balance))}</td></tr>
                </tbody>
              </table>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-ink/60">Receipts</p>
                {f.payments.length ? f.payments.map((p) => (
                  <Link key={p.id} href={`/portal/fees/receipt/${p.id}`} className="flex justify-between rounded-xl bg-cream px-3 py-2 hover:bg-sky-soft">
                    <span>{p.receiptNo} · {formatDate(p.date)}</span>
                    <span className="font-semibold tabular-nums">{naira(p.amount)}</span>
                  </Link>
                )) : <p className="text-ink/50">No payments yet this term.</p>}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
