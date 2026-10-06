import Link from "next/link";
import { LogoMark } from "./Doodles";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Doodlebrook Schools home">
      <LogoMark className="h-12 w-12 shrink-0 transition group-hover:animate-wiggle" />
      <span className={`leading-none ${light ? "text-white" : "text-ink"}`}>
        <span className="block font-scribble text-[2rem] font-bold leading-[0.8]">Doodlebrook</span>
        <span className={`mt-1 block whitespace-nowrap text-[0.6rem] font-bold uppercase tracking-[0.06em] ${light ? "text-sun" : "text-coral"}`}>Schools · Creche to Primary</span>
      </span>
    </Link>
  );
}
