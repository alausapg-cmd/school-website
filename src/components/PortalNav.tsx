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


export function PortalNav({ role }: { role: Role }) {
  const path = usePathname();
  return (
    <nav className="relative -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
      {NAV[role].map((item, i) => {
        const active = item.href === "/portal" ? path === "/portal" : path.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-3 rounded-2xl px-3 py-1.5 font-display font-semibold transition ${
              active
                ? `wood shadow-[0_4px_0_#4A2D12] ${i % 2 ? "lg:rotate-1" : "lg:-rotate-1"}`
                : "text-white/85 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className={`grid h-9 w-9 place-items-center rounded-full text-lg ${active ? "bg-sun-soft" : "bg-white/10"}`}>{item.emoji}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
