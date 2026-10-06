import Link from "next/link";
import { Logo } from "@/components/Logo";
import { PortalNav } from "@/components/PortalNav";
import { requireUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { logout } from "../login/actions";

const ROLE_LABEL = { admin: "Admin", teacher: "Teacher", student: "Pupil", parent: "Parent" };

export default async function PortalLayout({ children }: LayoutProps<"/portal">) {
  const user = await requireUser();
  const db = await getDB();
  const klass = user.classId ? db.classes.find((c) => c.id === user.classId) : null;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row print:block print:bg-white">
      <div className="relative border-b-2 border-ink bg-[#FFF4D2] print:hidden lg:w-[17rem] lg:shrink-0 lg:border-b-0 lg:border-r-2">
        {/* spiral binding */}
        <div className="spiral absolute -right-[13px] top-0 z-10 hidden h-full w-[24px] bg-position-[center_14px] lg:block" aria-hidden />
        <aside className="p-4 pb-3 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:pr-6">
          <div className="mb-3 flex items-center justify-between lg:mb-6">
            <Logo />
            <form action={logout} className="lg:hidden">
              <button className="btn-ghost px-3 py-1.5 text-sm">Log out</button>
            </form>
          </div>
          <PortalNav role={user.role} />
          <div className="mt-6 hidden space-y-2 border-t-2 border-dashed border-ink/20 pt-4 lg:block">
            <Link href="/" className="block px-3 font-display font-bold text-ink/70 hover:text-ink">🌐 School website</Link>
            <form action={logout}>
              <button className="px-3 font-display font-bold text-ink/70 hover:text-ink">👋 Log out</button>
            </form>
          </div>
        </aside>
      </div>
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-end gap-3 px-4 pt-5 sm:px-8 print:hidden">
          {/* a "Hello, my name is" sticker */}
          <div className="flex rotate-1 items-stretch overflow-hidden wobbly border-2 border-ink bg-white shadow-[3px_3px_0_rgb(42_43_51/0.2)]">
            <div className="flex flex-col justify-center bg-coral px-2.5 py-1 text-center text-white">
              <span className="text-[0.6rem] font-bold uppercase leading-none tracking-wider">Hello</span>
              <span className="text-[0.55rem] font-semibold uppercase leading-tight opacity-90">my name is</span>
            </div>
            <div className="px-3 py-1 text-right">
              <div className="font-scribble text-2xl font-bold leading-none">{user.name}</div>
              <div className="text-xs font-semibold text-ink/65">
                {ROLE_LABEL[user.role]}
                {klass ? ` · ${klass.name}` : ""}
              </div>
            </div>
          </div>
          <span className="grid h-12 w-12 shrink-0 -rotate-3 place-items-center rounded-full border-2 border-ink bg-sun-soft text-2xl">{user.avatar}</span>
        </header>
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-5 sm:px-8 print:max-w-none print:p-0">{children}</main>
      </div>
    </div>
  );
}
