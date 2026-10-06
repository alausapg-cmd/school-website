import Link from "next/link";
import { notFound } from "next/navigation";
import { Fireflies, Leaf } from "@/components/Jungle";
import { Owl } from "@/components/Owl";
import { getDB } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default async function NewsArticle({ params }: PageProps<"/news/[id]">) {
  const { id } = await params;
  const post = (await getDB()).news.find((n) => n.id === id);
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/news" className="btn-ghost text-sm">← All news</Link>
      <div className="relative mt-6 grid h-60 place-items-center overflow-hidden rounded-[2rem]" style={{ background: `${post.color}2e` }}>
        <Fireflies count={6} />
        <Leaf className="absolute -left-4 -top-6 h-28 w-20 rotate-[140deg] opacity-60" color={post.color} vein="#fff" />
        <Leaf className="absolute -bottom-8 left-1/3 h-28 w-20 rotate-12 opacity-40" />
        <Leaf className="absolute -right-4 top-4 h-24 w-16 -rotate-[60deg] opacity-60" color="#7CC24A" />
        <span className="relative grid h-32 w-32 place-items-center rounded-full bg-white text-7xl shadow-[0_8px_0_rgba(90,56,24,0.15)]">{post.emoji}</span>
        <Owl className="absolute bottom-2 right-4 hidden h-24 w-24 sm:block" />
      </div>
      <p className="hand mt-6 text-2xl text-wood">{formatDate(post.date, { dateStyle: "full" })}</p>
      <h1 className="mt-1 text-4xl font-extrabold sm:text-5xl">{post.title}</h1>
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink/80">
        {post.body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </article>
  );
}
