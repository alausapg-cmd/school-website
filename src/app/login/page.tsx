import Link from "next/link";
import { redirect } from "next/navigation";
import { C, CloudShape, Crayon, PlaneShape, StarShape } from "@/components/Doodles";
import { Logo } from "@/components/Logo";
import { PipSays } from "@/components/Doodles";
import { currentUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Log in" };

export default async function LoginPage() {
  if (await currentUser()) redirect("/portal");
  return (
    <main className="relative grid flex-1 place-items-center overflow-hidden px-4 py-10">
      <svg className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <g filter="url(#wobble)">
          <g className="animate-float"><CloudShape x={80} y={90} s={1.4} /></g>
          <g className="animate-float [animation-delay:2s]"><CloudShape x={980} y={140} s={1.1} /></g>
          <StarShape x={200} y={600} r={16} fill={C.grape} />
          <StarShape x={1040} y={560} r={14} />
          <StarShape x={1110} y={330} r={9} fill={C.pink} />
        </g>
        <path d="M60 740 C180 660 100 580 200 520 S260 440 190 400" fill="none" stroke={C.ink} strokeWidth={2.5} strokeDasharray="6 9" opacity={0.4} />
        <PlaneShape x={170} y={330} s={1.3} className="animate-fly" />
      </svg>
      <Crayon color={C.coral} className="pointer-events-none absolute bottom-10 right-[8%] hidden h-8 w-40 -rotate-12 md:block" />
      <Crayon color={C.sky} className="pointer-events-none absolute right-[14%] top-[16%] hidden h-7 w-32 rotate-[24deg] md:block" />
      <div className="relative w-full max-w-lg">
        <PipSays className="mb-2 justify-center">Welcome back! Ready to learn?</PipSays>
        <div className="card relative p-6 shadow-[6px_7px_0_rgb(42_43_51/0.2)] sm:p-8">
          <span className="tape" aria-hidden />
          <div className="mb-5 flex justify-center"><Logo /></div>
          <h1 className="text-center text-3xl sm:text-4xl">The Learning Portal</h1>
          <p className="mb-6 mt-1 text-center text-ink/70">Log in to see your notes, homework, quizzes and report cards.</p>
          <LoginForm />
          <p className="mt-6 text-center">
            <Link href="/" className="font-display text-lg font-bold text-sky">← Back to the school website</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
