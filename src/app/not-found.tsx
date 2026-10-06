import Link from "next/link";
import { Pip } from "@/components/Doodles";

export default function NotFound() {
  return (
    <main className="grid flex-1 place-items-center p-10 text-center">
      <div>
        <Pip className="mx-auto h-40 w-auto" mood="wow" />
        <h1 className="mt-4 text-4xl">Oops! This page got rubbed out.</h1>
        <p className="mt-2 text-ink/70">Pip looked everywhere, but couldn&apos;t find it.</p>
        <Link href="/" className="btn-primary mt-6">Take me home</Link>
      </div>
    </main>
  );
}
