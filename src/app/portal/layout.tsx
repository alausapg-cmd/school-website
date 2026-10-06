import Link from "next/link";
import { Logo } from "@/components/Logo";
import { PortalNav } from "@/components/PortalNav";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { logout } from "../login/actions";

const ROLE_LABEL = { admin: "Admin", teacher: "Teacher", student: "Pupil" };

export default async function PortalLayout({ children }: LayoutProps<"/portal">) {
  const user = await requireUser();
  const db = await getDB();
  const klass = user.classId ? db.classes.find((c) => c.id === user.classId) : null;

  return (
    <div className="flex min-h-screen flex-col bg-cream lg:flex-row">
      <div className="border-b-2 border-ink/5 bg-sun-soft/60 lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r-2">
      <aside className="p-4 lg:sticky lg:top-0 lg:h-screen">
        <div className="mb-4 flex items-center justify-between lg:mb-8">
          <Logo />
          <form action={logout} className="lg:hidden">
            <button className="btn-ghost px-3 py-1.5 text-sm">Log out</button>
          </form>
        </div>
        <PortalNav role={user.role} />
        <div className="mt-8 hidden space-y-2 lg:block">
          <Link href="/" className="block px-3 text-sm font-semibold text-ink/60 hover:text-ink">🌐 School website</Link>
          <form action={logout}>
            <button className="px-3 text-sm font-semibold text-ink/60 hover:text-ink">👋 Log out</button>
          </form>
        </div>
      </aside>
      </div>
      <div className="flex-1">
        <header className="flex items-center justify-end gap-3 px-4 pt-4 sm:px-8">
          <div className="text-right">
            <div className="font-display font-semibold leading-tight">{user.name}</div>
            <div className="text-xs text-ink/60">
              {ROLE_LABEL[user.role]}
              {klass ? ` · ${klass.name}` : ""}
            </div>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-2xl ring-2 ring-ink/10">{user.avatar}</span>
        </header>
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
