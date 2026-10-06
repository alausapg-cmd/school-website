import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Nova, Planet, Starfield } from "@/components/space/Art";
import { currentUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Log in" };

export default async function LoginPage() {
  if (await currentUser()) redirect("/portal");
  return (
    <main className="night relative grid flex-1 place-items-center overflow-hidden px-4 py-12">
      <Starfield shooting />
      <Planet color="#FF7A2F" shade="#B8400F" ring="#45E3CC" className="absolute -left-16 bottom-[-3rem] h-64 w-64 opacity-90 sm:left-[4%] sm:bottom-[8%] sm:h-52 sm:w-52" />
      <Planet color="#C8B6FF" shade="#7A4FD6" bands={false} className="absolute right-[6%] top-[8%] h-20 w-20 animate-drift" />
      <Nova className="absolute bottom-[10%] right-[8%] hidden h-48 w-auto rotate-12 animate-float lg:block" />
      <div className="relative w-full max-w-md">
        <div className="mb-4 flex justify-center"><Logo light /></div>
        <div className="card p-6 sm:p-8">
          <p className="kicker text-center text-coral">Mission Control</p>
          <h1 className="mt-1 text-center text-3xl font-extrabold">Ready for lift-off?</h1>
          <p className="mb-6 mt-1 text-center text-ink/65">Log in to see your notes, homework, quizzes and reports.</p>
          <LoginForm />
          <p className="mt-6 text-center text-sm">
            <Link href="/" className="font-bold text-sky">← Back to the school website</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
