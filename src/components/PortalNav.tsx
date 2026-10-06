"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/lib/types";

const NAV: Record<Role, { href: string; label: string; emoji: string }[]> = {
  student: [
    { href: "/portal", label: "My day", emoji: "🏠" },
    { href: "/portal/notes", label: "Notes", emoji: "📒" },
    { href: "/portal/assignments", label: "Homework", emoji: "✍️" },
    { href: "/portal/quizzes", label: "Quizzes", emoji: "🧠" },
    { href: "/portal/attendance", label: "Attendance", emoji: "📅" },
    { href: "/portal/results", label: "Report card", emoji: "🏆" },
  ],
  teacher: [
    { href: "/portal", label: "Dashboard", emoji: "🏠" },
    { href: "/portal/notes", label: "Notes & materials", emoji: "📒" },
    { href: "/portal/assignments", label: "Assignments", emoji: "✍️" },
    { href: "/portal/quizzes", label: "Assessments", emoji: "🧠" },
    { href: "/portal/attendance", label: "Attendance", emoji: "📅" },
    { href: "/portal/results", label: "Results", emoji: "🏆" },
  ],
  admin: [
    { href: "/portal", label: "Dashboard", emoji: "🏠" },
    { href: "/portal/news", label: "News", emoji: "📰" },
    { href: "/portal/events", label: "Events", emoji: "🎉" },
    { href: "/portal/people", label: "People", emoji: "👥" },
    { href: "/portal/attendance", label: "Attendance", emoji: "📅" },
    { href: "/portal/results", label: "Results", emoji: "🏆" },
  ],
};

const COLORS = ["bg-sky", "bg-grass", "bg-coral", "bg-grape", "bg-sun", "bg-sky"];

export function PortalNav({ role }: { role: Role }) {
  const path = usePathname();
  return (
    <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
      {NAV[role].map((item, i) => {
        const active = item.href === "/portal" ? path === "/portal" : path.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center gap-3 rounded-2xl px-3 py-2.5 font-display font-medium transition ${
              active ? "bg-white text-ink shadow-[0_4px_0_rgba(31,42,68,0.08)] ring-2 ring-ink/5" : "text-ink/70 hover:bg-white/60"
            }`}
          >
            <span className={`grid h-9 w-9 place-items-center rounded-xl text-lg ${active ? COLORS[i] : "bg-white/70"}`}>{item.emoji}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
