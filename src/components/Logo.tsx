import Image from "next/image";
import Link from "next/link";
import { school } from "@/lib/school";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <Image
        src={school.logo}
        alt=""
        width={48}
        height={48}
        priority
        className="h-12 w-12 rounded-full bg-white shadow-[0_3px_0_rgba(0,0,0,0.12)] ring-2 ring-sun transition group-hover:animate-wiggle"
      />
      <span className={`font-display text-lg font-bold leading-none ${light ? "text-white" : "text-sky"}`}>
        LIFE BUILDERS
        <span className={`block text-[0.7rem] font-semibold tracking-wide ${light ? "text-sun" : "text-coral"}`}>INT&apos;L SCHOOLS · DAY &amp; BOARDING</span>
      </span>
    </Link>
  );
}
