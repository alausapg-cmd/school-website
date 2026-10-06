import Link from "next/link";
import { school } from "@/lib/school";
import { Fireflies } from "./Jungle";
import { Logo } from "./Logo";
import { Owl } from "./Owl";
import { Wave } from "./Wave";

export function SiteFooter() {
  return (
    <footer className="mt-auto">
      <Wave className="text-jungle" />
      <div className="jungle-bg relative overflow-hidden text-white/85">
        <Fireflies count={10} />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.2fr_1.2fr]">
          <div className="space-y-3">
            <Logo light />
            <p className="hand text-2xl text-sun">{school.tagline}</p>
            <p className="text-sm">Motto: <b className="text-white">{school.motto}</b></p>
            <p className="text-xs text-white/60">{school.kind}</p>
          </div>
          <div>
            <h4 className="mb-3 text-lg text-white">Explore</h4>
            <ul className="space-y-1.5 text-sm">
              {[
                ["/about", "About us"],
                ["/news", "News"],
                ["/events", "Events"],
                ["/gallery", "Gallery"],
                ["/contact", "Admissions"],
                ["/apply", "Apply online"],
              ].map(([href, label]) => (
                <li key={href}><Link href={href} className="hover:text-sun">🍃 {label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-lg text-white">Visit our treehouse</h4>
            <p className="text-sm">{school.address}</p>
            <p className="mt-3 text-sm">Monday to Friday · 7:30am to 4:00pm</p>
          </div>
          <div>
            <h4 className="mb-3 text-lg text-white">Call or write</h4>
            {school.phones.map((p) => <p key={p} className="text-sm">📞 {p}</p>)}
            <p className="mt-1 break-words text-sm">✉️ {school.email}</p>
            <Link href="/login" className="btn-sun mt-4 text-sm">🎒 Learning Portal</Link>
          </div>
        </div>
        <div className="relative mx-auto flex max-w-6xl items-end justify-between gap-4 px-4">
          <p className="pb-4 text-xs text-white/55">
            © {new Date().getFullYear()} {school.name}. Grown with care in Ibadan.
          </p>
          <div className="relative hidden shrink-0 sm:block" aria-hidden>
            <Owl className="relative z-10 mx-auto -mb-2 h-24 w-24" />
            <div className="h-4 w-48 rounded-full bg-wood-dark" />
          </div>
        </div>
      </div>
    </footer>
  );
}
