"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/lib/types";

const NAV: Record<Role, { href: string; label: string; emoji: string }[]> = {
  student: [
    { href: "/portal", label: "My mission", emoji: "🚀" },
    { href: "/portal/notes", label: "Notes", emoji: "📒" },
    { href: "/portal/assignments", label: "Homework", emoji: "✍️" },
    { href: "/portal/quizzes", label: "Quizzes", emoji: "🧠" },
    { href: "/portal/timetable", label: "Timetable", emoji: "🕘" },
    { href: "/portal/attendance", label: "Attendance", emoji: "📅" },
    { href: "/portal/results", label: "Report card", emoji: "🏆" },
    { href: "/portal/notices", label: "Notice board", emoji: "📌" },
  ],
  teacher: [
    { href: "/portal", label: "Mission Control", emoji: "🛰️" },
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
    { href: "/portal", label: "My explorers", emoji: "👪" },
    { href: "/portal/fees", label: "School fees", emoji: "💳" },
    { href: "/portal/timetable", label: "Timetable", emoji: "🗓️" },
    { href: "/portal/notices", label: "Notice board", emoji: "📌" },
  ],
  admin: [
    { href: "/portal", label: "Mission Control", emoji: "🛰️" },
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

const COLORS = ["bg-sun", "bg-glow", "bg-rocket", "bg-lilac"];

export function PortalNav({ role }: { role: Role }) {
  const path = usePathname();
  return (
    <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0" aria-label="Portal">
      {NAV[role].map((item, i) => {
        const active = item.href === "/portal" ? path === "/portal" : path.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-3 rounded-2xl px-3 py-2 lg:py-1.5 font-display font-semibold transition ${
              active ? "bg-white text-ink shadow-[0_4px_0_rgba(0,0,0,0.25)]" : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className={`grid h-9 w-9 place-items-center rounded-full text-lg lg:h-8 lg:w-8 lg:text-base ${active ? COLORS[i % COLORS.length] : "bg-white/10"}`}>{item.emoji}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
