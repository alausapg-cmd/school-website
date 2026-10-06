import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { currentUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Log in" };

export default async function LoginPage() {
  if (await currentUser()) redirect("/portal");
  return (
    <main className="relative grid flex-1 place-items-center overflow-hidden bg-sky px-4 py-12">
      <div className="pointer-events-none absolute inset-0 text-6xl opacity-60" aria-hidden>
        <span className="absolute left-[8%] top-[12%] animate-float">☁️</span>
        <span className="absolute right-[10%] top-[20%] animate-float [animation-delay:1.5s]">⭐</span>
        <span className="absolute bottom-[14%] left-[14%] animate-float [animation-delay:2.5s]">📚</span>
        <span className="absolute bottom-[10%] right-[12%] animate-float [animation-delay:.5s]">✏️</span>
      </div>
      <div className="card relative w-full max-w-md p-8">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <h1 className="text-center text-3xl font-bold">Welcome to the Learning Portal</h1>
        <p className="mb-6 mt-1 text-center text-ink/60">Log in to see your notes, homework and quizzes.</p>
        <LoginForm />
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="font-semibold text-sky">← Back to the school website</Link>
        </p>
      </div>
    </main>
  );
}
