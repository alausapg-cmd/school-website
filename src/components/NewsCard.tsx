import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { NewsPost } from "@/lib/types";

const TILTS = ["-rotate-1", "rotate-1", "-rotate-[0.6deg]"];

export function NewsCard({ post, i = 0 }: { post: NewsPost; i?: number }) {
  return (
    <Link
      href={`/news/${post.id}`}
      className={`card group relative flex flex-col p-0 transition hover:-translate-y-1 hover:rotate-0 ${TILTS[i % TILTS.length]}`}
    >
      <span className="tape" aria-hidden />
      <div className="m-3 mb-0 grid h-36 place-items-center wobbly border-2 border-dashed border-ink/25 text-6xl" style={{ background: `${post.color}2e` }}>
        <span className="transition group-hover:scale-125 group-hover:-rotate-6">{post.emoji}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5 pt-4">
        <span className="text-xs font-bold uppercase tracking-wide text-ink/60">{formatDate(post.date)}</span>
        <h3 className="text-xl leading-snug group-hover:text-sky">{post.title}</h3>
        <p className="text-sm text-ink/75">{post.summary}</p>
        <span className="mt-auto pt-2 font-display text-base font-bold text-sky">Read more ✎</span>
      </div>
    </Link>
  );
}
