"use client";

import { useEffect, useState } from "react";

const BITS = ["🎉", "⭐", "🎈", "✨", "🌟", "🎊"];

export function Confetti() {
  const [pieces, setPieces] = useState<{ left: number; delay: number; emoji: string; dur: number }[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPieces(
      Array.from({ length: 36 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        dur: 2 + Math.random() * 1.5,
        emoji: BITS[i % BITS.length],
      })),
    );
    const t = setTimeout(() => setPieces([]), 4000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute -top-10 text-3xl"
          style={{ left: `${p.left}%`, animation: `confetti-fall ${p.dur}s ${p.delay}s ease-in forwards` }}
        >
          {p.emoji}
        </span>
      ))}
      <style>{`@keyframes confetti-fall { to { transform: translateY(110vh) rotate(540deg); } }`}</style>
    </div>
  );
}
