import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { NewsPost } from "@/lib/types";
import { MissionPatch } from "./space/MissionPatch";

export function NewsCard({ post }: { post: NewsPost }) {
  return (
    <Link href={`/news/${post.id}`} className="card group flex flex-col overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-[0_10px_0_rgba(58,63,191,0.12)]">
      <div className="night relative grid h-44 place-items-center overflow-hidden">
        <div aria-hidden className="stars absolute inset-0 opacity-70" />
        <div aria-hidden className="absolute -bottom-16 left-1/2 h-24 w-[130%] -translate-x-1/2 rounded-[50%]" style={{ background: post.color, opacity: 0.55 }} />
        <MissionPatch
          emoji={post.emoji}
          color={post.color}
          bottom={formatDate(post.date, { day: "numeric", month: "short", year: "numeric" }).toUpperCase()}
          className="relative h-36 w-36 drop-shadow-[0_6px_0_rgba(0,0,0,0.25)] transition duration-500 group-hover:rotate-[14deg] group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="kicker text-coral">{formatDate(post.date, { weekday: "short", day: "numeric", month: "long" })}</span>
        <h3 className="text-xl font-bold leading-snug group-hover:text-sky">{post.title}</h3>
        <p className="text-sm text-ink/70">{post.summary}</p>
        <span className="mt-auto pt-2 font-display text-sm font-bold text-sky">Read the mission log →</span>
      </div>
    </Link>
  );
}
