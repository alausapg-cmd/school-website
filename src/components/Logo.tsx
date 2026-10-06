import Link from "next/link";
import { OwlMark } from "./Owl";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <OwlMark className="h-12 w-12 shrink-0 drop-shadow-[0_3px_0_rgba(42,28,18,0.18)] transition group-hover:animate-wiggle" />
      <span className={`font-display text-2xl font-extrabold leading-none tracking-tight ${light ? "text-white" : "text-sky"}`}>
        Owl<span className={light ? "text-sun" : "text-coral"}>berry</span>
        <span className={`block text-[0.62rem] font-bold uppercase tracking-[0.18em] ${light ? "text-white/70" : "text-wood"}`}>International School</span>
      </span>
    </Link>
  );
}
