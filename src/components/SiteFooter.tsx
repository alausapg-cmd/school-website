import Link from "next/link";
import { school } from "@/lib/school";
import { Logo } from "./Logo";
import { Nova, Starfield } from "./space/Art";
import { Wave } from "./Wave";

export function SiteFooter() {
  return (
    <footer className="mt-auto">
      <Wave className="text-night" />
      <div className="relative overflow-hidden bg-night text-white/80">
        <Starfield />
        <Nova className="absolute -bottom-6 right-4 hidden h-40 w-auto rotate-12 opacity-90 lg:block" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Logo light />
            <p className="font-display text-lg leading-snug text-star">{school.tagline}</p>
            <p className="text-sm">Motto: {school.motto}</p>
          </div>
          <div>
            <h4 className="kicker mb-3 text-glow">Explore</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link href="/about" className="hover:text-star">About us</Link></li>
              <li><Link href="/news" className="hover:text-star">News</Link></li>
              <li><Link href="/events" className="hover:text-star">Events</Link></li>
              <li><Link href="/gallery" className="hover:text-star">Gallery</Link></li>
              <li><Link href="/contact" className="hover:text-star">Admissions</Link></li>
              <li><Link href="/apply" className="hover:text-star">Apply online</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="kicker mb-3 text-glow">Launch pad</h4>
            <p className="text-sm">{school.address}</p>
            <p className="mt-2 text-sm">Mon to Fri · 7:30am to 5:30pm</p>
          </div>
          <div>
            <h4 className="kicker mb-3 text-glow">Call or write</h4>
            {school.phones.map((p) => <p key={p} className="text-sm">📞 {p}</p>)}
            <p className="mt-1 break-words text-sm">✉️ {school.email}</p>
            <Link href="/login" className="btn-sun mt-4 text-sm">🚀 Learning Portal</Link>
          </div>
        </div>
        <p className="relative border-t border-white/10 px-4 py-4 text-center text-xs text-white/55">
          © {new Date().getFullYear()} {school.name} · {school.kind} · A fictional school for demonstration.
        </p>
      </div>
    </footer>
  );
}
