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
    { href: "/portal/timetable", label: "Timetable", emoji: "🕘" },
    { href: "/portal/attendance", label: "Attendance", emoji: "📅" },
    { href: "/portal/results", label: "Report card", emoji: "🏆" },
    { href: "/portal/notices", label: "Notice board", emoji: "📌" },
  ],
  teacher: [
    { href: "/portal", label: "Dashboard", emoji: "🏠" },
    { href: "/portal/students", label: "My pupils", emoji: "🧒" },
    { href: "/portal/notes", label: "Notes & materials", emoji: "📒" },
    { href: "/portal/assignments", label: "Assignments", emoji: "✍️" },
    { href: "/portal/quizzes", label: "Assessments", emoji: "🧠" },
    { href: "/portal/attendance", label: "Attendance", emoji: "📅" },
    { href: "/portal/results", label: "Results", emoji: "🏆" },
    { href: "/portal/timetable", label: "Timetable", emoji: "🕘" },
    { href: "/portal/notices", label: "Notice board", emoji: "📌" },
  ],
  parent: [
    { href: "/portal", label: "My children", emoji: "👪" },
    { href: "/portal/fees", label: "School fees", emoji: "💳" },
    { href: "/portal/timetable", label: "Timetable", emoji: "🗓️" },
    { href: "/portal/notices", label: "Notice board", emoji: "📌" },
  ],
  admin: [
    { href: "/portal", label: "Dashboard", emoji: "🏠" },
    { href: "/portal/students", label: "Students", emoji: "🧒" },
    { href: "/portal/fees", label: "Fees & payments", emoji: "💳" },
    { href: "/portal/admissions", label: "Admissions", emoji: "📝" },
    { href: "/portal/notices", label: "Notice board", emoji: "📌" },
    { href: "/portal/attendance", label: "Attendance", emoji: "📅" },
    { href: "/portal/results", label: "Results", emoji: "🏆" },
    { href: "/portal/timetable", label: "Timetable", emoji: "🕘" },
    { href: "/portal/people", label: "Staff & parents", emoji: "👥" },
    { href: "/portal/news", label: "Website news", emoji: "📰" },
    { href: "/portal/events", label: "Website events", emoji: "🎉" },
    { href: "/portal/settings", label: "Settings", emoji: "⚙️" },
  ],
};

// Crayon colours for the notebook tabs.
const TABS = ["#FFC83D", "#9CC7FF", "#9EDDAE", "#FFB8B0", "#C9B5F5"];

export function PortalNav({ role }: { role: Role }) {
  const path = usePathname();
  return (
    <nav aria-label="Portal" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 pt-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:p-0">
      {NAV[role].map((item, i) => {
        const active = item.href === "/portal" ? path === "/portal" : path.startsWith(item.href);
        const color = TABS[i % TABS.length];
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            style={active ? { background: color } : undefined}
            className={`flex shrink-0 items-center gap-2.5 border-2 px-3 py-1.5 font-display text-[1.05rem] font-bold leading-tight transition lg:py-2 ${
              active
                ? "wobbly border-ink text-ink shadow-[3px_3px_0_var(--color-ink)] lg:translate-x-3"
                : "wobbly border-transparent text-ink/75 hover:border-ink/30 hover:bg-white/70 hover:text-ink"
            }`}
          >
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 text-base ${active ? "border-ink bg-white" : "border-ink/20 bg-white/80"}`}
              style={active ? undefined : { boxShadow: `inset 0 -4px 0 ${color}` }}
            >
              {item.emoji}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
