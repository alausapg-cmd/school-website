import type { ReactNode } from "react";
import { Fireflies, Fruit, Vines } from "./Jungle";
import { Wave } from "./Wave";

// Page banner: a jungle clearing with hanging vines, a fruit badge and a wooden sign title.
export function PageHero({
  emoji,
  title,
  text,
  color = "bg-sky",
  fruit = "mango",
  kicker,
  children,
}: {
  emoji: string;
  title: string;
  text?: string;
  color?: string;
  fruit?: string;
  kicker?: string;
  children?: ReactNode;
}) {
  return (
    <section className={`relative overflow-hidden ${color} text-white`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(255,179,32,0.35),transparent_60%)]" aria-hidden />
      <Vines />
      <Fireflies count={6} />
      <div className="relative mx-auto max-w-4xl px-4 pb-6 pt-20 text-center sm:pt-24">
        <Fruit kind={fruit} className="mx-auto h-24 w-24 animate-bob text-5xl">{emoji}</Fruit>
        {kicker && <p className="hand mt-3 text-2xl text-sun">{kicker}</p>}
        <h1 className="mt-2 text-4xl font-extrabold drop-shadow-[0_3px_0_rgba(0,0,0,0.25)] sm:text-6xl">{title}</h1>
        {text && <p className="mx-auto mt-3 max-w-xl text-lg text-white/90">{text}</p>}
        {children}
      </div>
      <Wave className="text-cream" />
    </section>
  );
}
