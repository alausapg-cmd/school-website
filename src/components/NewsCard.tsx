import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { NewsPost } from "@/lib/types";

export function NewsCard({ post }: { post: NewsPost }) {
  return (
    <Link href={`/news/${post.id}`} className="card group flex flex-col overflow-hidden p-0 transition hover:-translate-y-1">
      <div className="grid h-40 place-items-center text-6xl" style={{ background: `${post.color}22` }}>
        <span className="transition group-hover:scale-125">{post.emoji}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs font-bold uppercase tracking-wide text-ink/50">{formatDate(post.date)}</span>
        <h3 className="text-xl font-semibold leading-snug group-hover:text-sky">{post.title}</h3>
        <p className="text-sm text-ink/70">{post.summary}</p>
        <span className="mt-auto pt-2 font-display text-sm font-semibold text-sky">Read more →</span>
      </div>
    </Link>
  );
}
