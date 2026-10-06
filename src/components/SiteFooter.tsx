import Link from "next/link";
import { school } from "@/lib/school";
import { Crayon } from "./Doodles";
import { Logo } from "./Logo";
import { Wave } from "./Wave";

export function SiteFooter() {
  return (
    <footer className="mt-auto">
      <div className="mx-auto flex max-w-6xl justify-end gap-1 px-4" aria-hidden>
        <Crayon color="#E5484D" className="h-5 w-24 -rotate-6" />
        <Crayon color="#FFC83D" className="h-5 w-20 rotate-3" />
        <Crayon color="#1F5FC4" className="h-5 w-24 -rotate-2" />
      </div>
      <Wave className="text-ink" />
      <div className="bg-ink text-white/85">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Logo light />
            <p className="font-scribble text-3xl leading-none text-sun">{school.tagline}</p>
            <p className="text-sm">Motto: {school.motto}</p>
          </div>
          <div>
            <h4 className="mb-3 text-xl text-white">Explore</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link href="/about" className="hover:text-sun">About us</Link></li>
              <li><Link href="/news" className="hover:text-sun">News</Link></li>
              <li><Link href="/events" className="hover:text-sun">Events</Link></li>
              <li><Link href="/gallery" className="hover:text-sun">Gallery</Link></li>
              <li><Link href="/contact" className="hover:text-sun">Admissions</Link></li>
              <li><Link href="/apply" className="hover:text-sun">Apply online</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xl text-white">Visit us</h4>
            <p className="text-sm">{school.address}</p>
            <p className="mt-2 text-sm text-white/60">{school.kind}</p>
            <p className="mt-1 text-sm text-white/60">Monday to Friday, 7:30am to 2:30pm</p>
          </div>
          <div>
            <h4 className="mb-3 text-xl text-white">Call or write</h4>
            {school.phones.map((p) => <p key={p} className="text-sm">📞 {p}</p>)}
            <p className="mt-1 break-words text-sm">✉️ {school.email}</p>
            <Link href="/login" className="btn-sun mt-4 text-sm">✏️ Learning Portal</Link>
          </div>
        </div>
        <p className="border-t border-dashed border-white/20 px-4 py-4 text-center text-xs text-white/55">
          © {new Date().getFullYear()} {school.name} · {school.approvals.join(" · ")} · Drawn with love (and a lot of crayons).
        </p>
      </div>
    </footer>
  );
}
