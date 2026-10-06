import Link from "next/link";
import { Logo } from "@/components/Logo";
import { PortalNav } from "@/components/PortalNav";
import { Nova } from "@/components/space/Art";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { logout } from "../login/actions";

const ROLE_LABEL = { admin: "Flight director", teacher: "Teacher", student: "Explorer", parent: "Parent" };

export default async function PortalLayout({ children }: LayoutProps<"/portal">) {
  const user = await requireUser();
  const db = await getDB();
  const klass = user.classId ? db.classes.find((c) => c.id === user.classId) : null;

  return (
    <div className="flex min-h-screen flex-col bg-cream lg:flex-row print:block print:bg-white">
      <div className="night relative print:hidden lg:w-68 lg:shrink-0">
        <div aria-hidden className="stars pointer-events-none absolute inset-0 opacity-60" />
        <aside className="relative p-4 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:overflow-y-auto">
          <div className="mb-3 flex items-center justify-between lg:mb-2">
            <Logo light />
            <form action={logout} className="lg:hidden">
              <button className="btn-space px-3 py-1.5 text-sm">Log out</button>
            </form>
          </div>
          <p className="kicker mb-3 hidden items-center gap-2 text-glow lg:flex">
            <span className="h-2 w-2 animate-twinkle rounded-full bg-glow" /> Mission Control
          </p>
          <PortalNav role={user.role} />
          <div className="mt-6 hidden space-y-2 lg:block">
            <Link href="/" className="block px-3 text-sm font-semibold text-white/65 hover:text-white">🌐 School website</Link>
            <form action={logout}>
              <button className="px-3 text-sm font-semibold text-white/65 hover:text-white">👋 Log out</button>
            </form>
          </div>
          <div className="mt-auto hidden pt-6 lg:block">
            <div className="flex items-end gap-2 rounded-2xl bg-white/8 p-3 ring-1 ring-white/10">
              <Nova className="h-16 w-auto shrink-0" />
              <p className="text-xs text-white/75"><b className="block font-display text-sm text-star">Nova&apos;s tip</b>Small steps every day add up to giant leaps.</p>
            </div>
          </div>
        </aside>
      </div>
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-8 print:hidden">
          <span className="kicker hidden items-center gap-2 text-ink/45 sm:flex">
            <span className="h-2 w-2 rounded-full bg-grass" /> All systems go · {db.settings.term}, {db.settings.session}
          </span>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <div className="font-display font-bold leading-tight">{user.name}</div>
              <div className="text-xs text-ink/60">
                {ROLE_LABEL[user.role]}
                {klass ? ` · ${klass.name}` : ""}
              </div>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-2xl ring-2 ring-sky/20 shadow-[0_3px_0_rgba(58,63,191,0.12)]">{user.avatar}</span>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-8 print:max-w-none print:p-0">{children}</main>
      </div>
    </div>
  );
}
