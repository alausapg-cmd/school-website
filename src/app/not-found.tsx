import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid flex-1 place-items-center p-10 text-center">
      <div>
        <div className="text-8xl">🙈</div>
        <h1 className="mt-4 text-4xl font-bold">Oops! We couldn&apos;t find that page.</h1>
        <Link href="/" className="btn-primary mt-6">Take me home</Link>
      </div>
    </main>
  );
}
