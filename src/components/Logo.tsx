import Link from "next/link";
import { school } from "@/lib/school";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sun text-2xl shadow-[0_4px_0_#e0a800] transition group-hover:animate-wiggle">
        {school.logo}
      </span>
      <span className={`font-display text-xl font-bold leading-none ${light ? "text-white" : "text-ink"}`}>
        {school.shortName}
        <span className="block text-xs font-medium tracking-wide opacity-70">ACADEMY</span>
      </span>
    </Link>
  );
}
