import Link from "next/link";
import { notFound } from "next/navigation";
import { getDB } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default async function NewsArticle({ params }: PageProps<"/news/[id]">) {
  const { id } = await params;
  const post = (await getDB()).news.find((n) => n.id === id);
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/news" className="font-display font-semibold text-sky">← All news</Link>
      <div className="mt-6 grid h-56 place-items-center rounded-[2rem] text-8xl" style={{ background: `${post.color}22` }}>
        {post.emoji}
      </div>
      <p className="mt-6 text-sm font-bold uppercase tracking-wide text-ink/50">{formatDate(post.date, { dateStyle: "full" })}</p>
      <h1 className="mt-1 text-4xl font-bold sm:text-5xl">{post.title}</h1>
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink/80">
        {post.body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </article>
  );
}
