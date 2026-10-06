import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { NewsPost } from "@/lib/types";
import { Leaf } from "./Jungle";

export function NewsCard({ post }: { post: NewsPost }) {
  return (
    <Link href={`/news/${post.id}`} className="card group relative flex flex-col overflow-hidden p-0 transition hover:-translate-y-1 hover:rotate-[0.6deg]">
      <div className="relative grid h-44 place-items-center overflow-hidden" style={{ background: `${post.color}26` }}>
        <Leaf className="absolute -left-3 -top-4 h-20 w-14 rotate-[140deg] opacity-70" color={post.color} vein="#fff" />
        <Leaf className="absolute -bottom-6 right-6 h-24 w-16 rotate-[20deg] opacity-50" />
        <Leaf className="absolute -right-4 top-3 h-16 w-12 -rotate-[60deg] opacity-60" color="#7CC24A" />
        <span className="relative grid h-24 w-24 place-items-center rounded-full bg-white text-5xl shadow-[0_6px_0_rgba(90,56,24,0.15)] ring-4 ring-white/60 transition group-hover:scale-110 group-hover:rotate-6">
          {post.emoji}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="hand text-xl leading-none text-wood">{formatDate(post.date)}</span>
        <h3 className="text-xl font-bold leading-snug group-hover:text-sky">{post.title}</h3>
        <p className="text-sm text-ink/70">{post.summary}</p>
        <span className="mt-auto pt-2 font-display text-sm font-bold text-coral">Read the story 🍃</span>
      </div>
    </Link>
  );
}
