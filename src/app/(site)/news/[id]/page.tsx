import Link from "next/link";
import { notFound } from "next/navigation";
import { C, Scribble } from "@/components/Doodles";
import { getDB } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default async function NewsArticle({ params }: PageProps<"/news/[id]">) {
  const { id } = await params;
  const post = (await getDB()).news.find((n) => n.id === id);
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/news" className="font-display text-lg font-bold text-sky">← All news</Link>
      <div className="relative mt-6 grid h-56 place-items-center wobbly-lg border-2 border-ink text-8xl shadow-[5px_6px_0_rgb(42_43_51/0.15)]" style={{ background: `${post.color}2e` }}>
        <span className="tape" aria-hidden />
        {post.emoji}
      </div>
      <p className="mt-8 text-sm font-bold uppercase tracking-wide text-ink/60">{formatDate(post.date, { dateStyle: "full" })}</p>
      <h1 className="mt-1 text-4xl sm:text-5xl">{post.title}</h1>
      <Scribble color={C.sun} className="mt-1 h-4 w-48" />
      <div className="lined mt-6 space-y-8 wobbly border-2 border-ink/80 py-[7px] pl-16 pr-6 text-lg leading-8 text-ink/90">
        {post.body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </article>
  );
}
