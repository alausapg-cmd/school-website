import Link from "next/link";
import { notFound } from "next/navigation";
import { LogoMark } from "@/components/Doodles";
import { PrintButton } from "@/components/PrintButton";
import { Notice } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { feeStatus, naira } from "@/lib/fees";
import { formatDate } from "@/lib/format";
import { school } from "@/lib/school";
import { canViewStudent, lookups } from "@/lib/scope";

export const metadata = { title: "Receipt" };

export default async function ReceiptPage({ params, searchParams }: PageProps<"/portal/fees/receipt/[id]">) {
  const user = await requireUser("admin", "parent");
  const db = await getDB();
  const { id } = await params;
  const sp = await searchParams;
  const p = db.payments.find((x) => x.id === id);
  const s = p && db.users.find((u) => u.id === p.studentId);
  if (!p || !s || !canViewStudent(user, s)) notFound();
  const { klass, user: who } = lookups(db);
  const f = feeStatus(db, s, p.term, p.session);
  const paidToDate = f.payments.filter((x) => x.date <= p.date).reduce((t, x) => t + x.amount, 0);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <Link href={user.role === "admin" ? "/portal/fees" : "/portal/fees"} className="font-display font-semibold text-sky">← Fees</Link>
        <PrintButton label="🖨️ Print receipt" />
      </div>
      {sp.new && <Notice>✅ Payment saved. Print or share this receipt with the parent.</Notice>}
      <div className="card relative p-6 sm:p-8 print:rounded-none print:border-0 print:bg-white print:shadow-none">
        <div className="flex flex-wrap items-center gap-4 border-b-2 border-dashed border-ink/30 pb-4">
          <LogoMark className="h-16 w-16 shrink-0" />
          <div>
            <h1 className="text-2xl leading-tight text-ink">{school.name}</h1>
            <p className="text-xs text-ink/60">{school.shortAddress} · {school.phones[0]}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="inline-block -rotate-3 border-2 border-coral px-2 font-display text-lg font-bold tracking-widest text-coral">RECEIPT</p>
            <p className="font-mono text-sm">{p.receiptNo}</p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-y-2 py-5 text-sm">
          <dt className="text-ink/60">Received from</dt><dd className="font-semibold">{s.parentId ? who(s.parentId)?.name : "Parent/guardian"}</dd>
          <dt className="text-ink/60">For pupil</dt><dd className="font-semibold">{s.name} ({s.admissionNo})</dd>
          <dt className="text-ink/60">Class</dt><dd>{klass(s.classId!)?.name}</dd>
          <dt className="text-ink/60">Term</dt><dd>{p.term}, {p.session}</dd>
          <dt className="text-ink/60">Date</dt><dd>{formatDate(p.date, { dateStyle: "long" })}</dd>
          <dt className="text-ink/60">Method</dt><dd>{p.method}{p.reference ? ` · ${p.reference}` : ""}</dd>
        </dl>
        <div className="wobbly border-2 border-ink bg-sun-soft p-5 text-center">
          <p className="text-sm text-ink/60">Amount paid</p>
          <p className="font-display text-4xl font-bold text-ink">{naira(p.amount)}</p>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-y-1 text-sm">
          <dt className="text-ink/60">Total fees for the term</dt><dd className="text-right tabular-nums">{naira(f.billed)}</dd>
          <dt className="text-ink/60">Paid to date</dt><dd className="text-right tabular-nums">{naira(paidToDate)}</dd>
          <dt className="font-bold">Balance after this payment</dt><dd className="text-right font-bold tabular-nums">{naira(Math.max(0, f.billed - paidToDate))}</dd>
        </dl>
        <div className="mt-8 flex items-end justify-between text-xs text-ink/60">
          <p>Received by: {who(p.receivedBy)?.name ?? "Bursary"}</p>
          <p className="border-t border-ink/30 pt-1">Bursar&apos;s signature</p>
        </div>
        <p className="mt-6 text-center font-scribble text-2xl text-coral">{school.tagline} ✎</p>
      </div>
    </div>
  );
}
