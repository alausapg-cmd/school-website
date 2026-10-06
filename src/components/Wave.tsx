// A bushy, leafy edge between sections (the colour comes from the text colour).
export function Wave({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  const back = Array.from({ length: 16 }, () => "a 45 45 0 0 1 90 0").join(" ");
  const front = Array.from({ length: 24 }, (_, i) => (i % 2 ? "a 30 26 0 0 1 60 0" : "a 30 34 0 0 1 60 0")).join(" ");
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`block h-10 w-full sm:h-16 ${flip ? "rotate-180" : ""} ${className}`}
      aria-hidden
    >
      <path fill="#7CC24A" opacity="0.5" d={`M-20 80 L-20 52 ${back} L1460 80 Z`} />
      <path fill="currentColor" d={`M0 80 L0 62 ${front} L1440 80 Z`} />
    </svg>
  );
}
