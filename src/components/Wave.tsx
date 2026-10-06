export function Wave({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`block h-10 w-full sm:h-16 ${flip ? "rotate-180" : ""} ${className}`}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0,40 C120,70 240,10 360,30 C480,50 600,80 720,60 C840,40 960,0 1080,20 C1200,40 1320,70 1440,50 L1440,80 L0,80 Z"
      />
    </svg>
  );
}
