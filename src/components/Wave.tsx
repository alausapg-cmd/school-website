// The curved edge of a planet's horizon, used to close off night-sky sections.
export function Wave({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`block h-10 w-full sm:h-16 ${flip ? "rotate-180" : ""} ${className}`}
      aria-hidden
    >
      <path fill="currentColor" d="M0,80 L0,58 Q720,-22 1440,58 L1440,80 Z" />
    </svg>
  );
}
