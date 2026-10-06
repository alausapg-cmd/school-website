import Link from "next/link";
import { redirect } from "next/navigation";
import { Fireflies, Vines } from "@/components/Jungle";
import { Logo } from "@/components/Logo";
import { Owl } from "@/components/Owl";
import { currentUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Log in" };

export default async function LoginPage() {
  if (await currentUser()) redirect("/portal");
  return (
    <main className="jungle-bg relative grid flex-1 place-items-center overflow-hidden px-4 pb-12 pt-28">
      <Vines lengths={[90, 140, 60, 120, 80, 150, 70, 110]} />
      <Fireflies count={12} />
      <div className="relative w-full max-w-md">
        <div className="absolute -top-24 left-1/2 flex -translate-x-1/2 items-end gap-2">
          <Owl wave className="h-28 w-28" />
          <div className="relative mb-12 whitespace-nowrap rounded-2xl bg-white px-3 py-1.5 text-ink shadow-lg">
            <span className="hand text-xl text-grape">Hoo goes there?</span>
            <span className="absolute -left-1.5 bottom-2 h-3 w-3 rotate-45 bg-white" aria-hidden />
          </div>
        </div>
        <div className="card relative border-t-8 border-sun p-6 text-ink sm:p-8">
          <div className="mb-4 flex justify-center"><Logo /></div>
          <h1 className="text-center text-3xl font-extrabold">Welcome to the Learning Portal</h1>
          <p className="mb-6 mt-1 text-center text-ink/60">Log in to climb up to your notes, homework and quizzes.</p>
          <LoginForm />
          <p className="mt-6 text-center text-sm">
            <Link href="/" className="font-bold text-sky">← Back to the school website</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
