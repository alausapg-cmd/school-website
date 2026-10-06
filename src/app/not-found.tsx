import Link from "next/link";
import { Owl } from "@/components/Owl";

export default function NotFound() {
  return (
    <main className="leafy-bg grid flex-1 place-items-center p-10 text-center">
      <div>
        <Owl className="mx-auto h-40 w-36" />
        <p className="hand mt-4 text-3xl text-coral">Hoo? Hoo knows!</p>
        <h1 className="mt-1 text-4xl font-extrabold">This path got lost in the jungle.</h1>
        <Link href="/" className="btn-primary mt-6">🌳 Back to the treehouse</Link>
      </div>
    </main>
  );
}
