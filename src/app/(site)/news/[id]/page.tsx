import Link from "next/link";
import { notFound } from "next/navigation";
import { MissionPatch } from "@/components/space/MissionPatch";
import { getDB } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default async function NewsArticle({ params }: PageProps<"/news/[id]">) {
  const { id } = await params;
  const post = (await getDB()).news.find((n) => n.id === id);
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/news" className="font-display font-bold text-sky">← All mission logs</Link>
      <div className="night relative mt-6 grid h-64 place-items-center overflow-hidden rounded-[2rem]">
        <div aria-hidden className="stars absolute inset-0 opacity-80" />
        <div aria-hidden className="absolute -bottom-24 left-1/2 h-36 w-[140%] -translate-x-1/2 rounded-[50%]" style={{ background: post.color, opacity: 0.6 }} />
        <MissionPatch emoji={post.emoji} color={post.color} bottom={formatDate(post.date).toUpperCase()} className="relative h-48 w-48 drop-shadow-[0_8px_0_rgba(0,0,0,0.3)]" />
      </div>
      <p className="kicker mt-6 text-coral">{formatDate(post.date, { dateStyle: "full" })}</p>
      <h1 className="mt-1 text-4xl font-extrabold sm:text-5xl">{post.title}</h1>
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink/80">
        {post.body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </article>
  );
}
