import Link from "next/link";
import { Nova, Starfield } from "@/components/space/Art";

export default function NotFound() {
  return (
    <main className="night relative grid flex-1 place-items-center overflow-hidden p-10 text-center">
      <Starfield shooting />
      <div className="relative">
        <Nova className="mx-auto h-44 w-auto rotate-[30deg] animate-float" title="Nova, a little lost" />
        <p className="kicker mt-4 text-star">Error 404 · Lost in space</p>
        <h1 className="mt-2 text-4xl font-extrabold">Oops! This page drifted out of orbit.</h1>
        <Link href="/" className="btn-sun mt-6">Beam me home</Link>
      </div>
    </main>
  );
}
