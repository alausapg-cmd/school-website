import Link from "next/link";
import { LogoMark } from "./space/Art";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Novaridge Academy home">
      <LogoMark className="h-12 w-12 shrink-0 drop-shadow-[0_3px_0_rgba(22,26,61,0.15)] transition group-hover:rotate-[-12deg]" />
      <span className={`font-display text-xl font-extrabold leading-none tracking-tight ${light ? "text-white" : "text-ink"}`}>
        Novaridge
        <span className={`mt-0.5 block font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] ${light ? "text-star" : "text-coral"}`}>Academy · Lekki</span>
      </span>
    </Link>
  );
}
