import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Owl } from "@/components/Owl";
import { PortalNav } from "@/components/PortalNav";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import type { Role } from "@/lib/types";
import { logout } from "../login/actions";

const ROLE_LABEL = { admin: "Admin", teacher: "Teacher", student: "Pupil", parent: "Parent" };

const TIPS: Record<Role, string[]> = {
  student: ["Read for ten minutes today. Hoo-ray for books!", "Stuck on a sum? Draw it out!", "Drink water and stretch your wings.", "Ask one curious question today.", "Kind words make the jungle brighter."],
  teacher: ["A quick quiz helps ideas take root.", "Praise effort, not just answers.", "Remember to take today's register.", "Short notes, big pictures, happy owls.", "A story a day keeps boredom away."],
  parent: ["Ask your child what made them curious today.", "Ten minutes of reading together works wonders.", "Check the notice board for upcoming events.", "A good night's sleep grows wise owls.", "Praise the effort, celebrate the progress."],
  admin: ["Check the fees page for who still owes.", "New applications may be waiting.", "Post a notice to keep families in the loop.", "Share good news on the website.", "Keep term dates up to date in Settings."],
};

export default async function PortalLayout({ children }: LayoutProps<"/portal">) {
  const user = await requireUser();
  const db = await getDB();
  const klass = user.classId ? db.classes.find((c) => c.id === user.classId) : null;
  const tips = TIPS[user.role];
  const tip = tips[new Date().getDate() % tips.length];

  return (
    <div className="leafy-bg flex min-h-screen flex-col lg:flex-row print:block print:bg-white print:bg-none">
      <div className="jungle-bg relative print:hidden lg:w-64 lg:shrink-0">
        <aside className="relative p-4 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:overflow-y-auto">
          <div className="relative mb-4 flex items-center justify-between lg:mb-6">
            <Logo light />
            <form action={logout} className="lg:hidden">
              <button className="btn-wood px-3 py-1.5 text-sm">Log out</button>
            </form>
          </div>
          <PortalNav role={user.role} />
          <div className="relative mt-auto hidden pt-6 lg:block">
            <div className="flex items-end gap-1">
              <Owl className="h-16 w-16 shrink-0" hat={false} />
              <div className="mb-3 space-y-1.5">
                <Link href="/" className="block text-sm font-bold text-white/75 hover:text-sun">🌳 School website</Link>
                <form action={logout}>
                  <button className="text-sm font-bold text-white/75 hover:text-sun">👋 Log out</button>
                </form>
              </div>
            </div>
            <div className="wood -mt-1 h-3 rounded-full" aria-hidden />
          </div>
        </aside>
      </div>
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-8 print:hidden">
          <div className="hidden min-w-0 items-center gap-2 md:flex">
            <Owl className="h-11 w-11 shrink-0" />
            <p className="relative min-w-0 truncate rounded-2xl bg-white px-3 py-1.5 text-sm shadow-[0_3px_0_rgba(90,56,24,0.1)] ring-2 ring-wood/10">
              <b className="text-grape">Professor Hoot:</b> <span className="text-ink/75">{tip}</span>
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <div className="font-display font-bold leading-tight">{user.name}</div>
              <div className="text-xs text-ink/60">
                {ROLE_LABEL[user.role]}
                {klass ? ` · ${klass.name}` : ""}
              </div>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-sun-soft text-2xl ring-4 ring-sun">{user.avatar}</span>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-8 print:p-0">{children}</main>
      </div>
    </div>
  );
}
