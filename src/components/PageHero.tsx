import { Starfield } from "./space/Art";
import { Wave } from "./Wave";

// Night-sky page banner. `color` tints the planet floating in the corner.
export function PageHero({ emoji, title, text, color = "bg-sky", kicker }: { emoji: string; title: string; text?: string; color?: string; kicker?: string }) {
  return (
    <section className="night relative overflow-hidden">
      <Starfield shooting />
      <div aria-hidden className={`${color} absolute -right-16 -top-20 h-64 w-64 rounded-full opacity-90 shadow-[inset_-28px_-20px_0_rgba(0,0,0,0.22)] sm:right-[6%] sm:top-8 sm:h-40 sm:w-40`} />
      <div aria-hidden className="absolute -right-24 top-6 h-14 w-96 -rotate-12 rounded-[50%] border-4 border-white/25 sm:right-[2%] sm:top-[5.5rem] sm:w-64" />
      <div aria-hidden className="absolute bottom-16 left-[7%] hidden h-10 w-10 rounded-full bg-lilac/80 shadow-[inset_-6px_-4px_0_rgba(0,0,0,0.2)] sm:block" />
      <div className="relative mx-auto max-w-6xl px-4 pb-6 pt-12 text-center sm:pt-16">
        <div className="mx-auto grid h-20 w-20 animate-bob place-items-center rounded-full bg-white/10 text-5xl ring-2 ring-white/25 backdrop-blur">{emoji}</div>
        {kicker && <p className="kicker mt-4 text-star">{kicker}</p>}
        <h1 className="mt-3 text-4xl font-extrabold sm:text-6xl">{title}</h1>
        {text && <p className="mx-auto mt-3 max-w-xl text-lg text-white/85">{text}</p>}
      </div>
      <Wave className="relative text-cream" />
    </section>
  );
}
