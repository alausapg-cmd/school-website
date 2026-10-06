import { Wave } from "./Wave";

export function PageHero({ emoji, title, text, color = "bg-sky" }: { emoji: string; title: string; text?: string; color?: string }) {
  return (
    <section className={`${color} text-white`}>
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-12 text-center">
        <div className="text-6xl">{emoji}</div>
        <h1 className="mt-2 text-5xl font-bold">{title}</h1>
        {text && <p className="mx-auto mt-3 max-w-xl text-lg opacity-90">{text}</p>}
      </div>
      <Wave className="text-cream" />
    </section>
  );
}
