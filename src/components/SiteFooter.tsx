import Link from "next/link";
import { school } from "@/lib/school";
import { Logo } from "./Logo";
import { Wave } from "./Wave";

export function SiteFooter() {
  return (
    <footer className="mt-auto">
      <Wave className="text-ink" />
      <div className="bg-ink text-white/80">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Logo light />
            <p className="text-sm">{school.motto}</p>
          </div>
          <div>
            <h4 className="mb-3 text-lg text-white">Explore</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link href="/about" className="hover:text-sun">About us</Link></li>
              <li><Link href="/news" className="hover:text-sun">News</Link></li>
              <li><Link href="/events" className="hover:text-sun">Events</Link></li>
              <li><Link href="/gallery" className="hover:text-sun">Gallery</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-lg text-white">Visit us</h4>
            <p className="text-sm">{school.address}</p>
            <p className="mt-2 text-sm">{school.hours}</p>
          </div>
          <div>
            <h4 className="mb-3 text-lg text-white">Say hello</h4>
            <p className="text-sm">📞 {school.phone}</p>
            <p className="text-sm">✉️ {school.email}</p>
            <Link href="/login" className="btn-sun mt-4 text-sm">🎒 Learning Portal</Link>
          </div>
        </div>
        <p className="border-t border-white/10 py-4 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {school.name}. Made with 💛 for curious minds.
        </p>
      </div>
    </footer>
  );
}
