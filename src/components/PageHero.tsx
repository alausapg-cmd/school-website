import type { CSSProperties } from "react";
import { C, Pip, Scribble, Squiggle } from "./Doodles";

const TONES = {
  sky: { hl: "#9CC7FF", line: C.sky, sticker: "bg-sky-soft" },
  sun: { hl: "#FFD866", line: C.orange, sticker: "bg-sun-soft" },
  grass: { hl: "#9EDDAE", line: C.grass, sticker: "bg-grass-soft" },
  coral: { hl: "#FFB8B0", line: C.coral, sticker: "bg-coral-soft" },
  grape: { hl: "#C9B5F5", line: C.grape, sticker: "bg-grape-soft" },
};
export type Tone = keyof typeof TONES;

export function PageHero({ emoji, title, text, tone = "sky", pipSays }: { emoji: string; title: string; text?: string; tone?: Tone; pipSays?: string }) {
  const t = TONES[tone];
  return (
    <section className="relative overflow-hidden border-b-2 border-dashed border-ink/20">
      <Squiggle color={t.line} className="absolute -left-6 top-10 hidden w-40 -rotate-12 opacity-70 md:block" />
      <Squiggle color={C.sun} className="absolute bottom-8 right-[18%] hidden w-28 rotate-6 opacity-80 md:block" />
      <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-10 text-center sm:pb-12 sm:pt-14">
        <div className={`pop-in mx-auto grid h-20 w-20 place-items-center wobbly border-2 border-ink ${t.sticker} text-5xl shadow-[3px_3px_0_var(--color-ink)]`} style={{ "--tilt": "-6deg" } as CSSProperties}>
          <span aria-hidden>{emoji}</span>
        </div>
        <h1 className="relative mx-auto mt-4 inline-block text-[2.6rem] leading-tight sm:text-6xl">
          <span className="highlight" style={{ "--hl": t.hl } as CSSProperties}>{title}</span>
          <Scribble color={t.line} className="mx-auto mt-1 h-4 w-3/4" />
        </h1>
        {text && <p className="mx-auto mt-3 max-w-xl text-lg text-ink/75">{text}</p>}
      </div>
      <div className="absolute bottom-0 right-6 hidden translate-y-6 lg:flex lg:items-start lg:gap-2">
        {pipSays && (
          <p className="mt-6 max-w-[11rem] wobbly border-2 border-ink bg-paper px-3 py-2 text-left font-display text-base leading-snug shadow-[3px_3px_0_rgb(42_43_51/0.15)]">
            {pipSays}
          </p>
        )}
        <Pip className="h-36 w-auto rotate-6" />
      </div>
    </section>
  );
}
