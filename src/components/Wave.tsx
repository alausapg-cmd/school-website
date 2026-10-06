// A torn sketchbook-paper edge used between sections.
export function Wave({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      className={`block h-6 w-full sm:h-9 ${flip ? "rotate-180" : ""} ${className}`}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0 30 L38 22 L70 32 L104 18 L150 28 L186 16 L230 30 L262 20 L310 34 L350 18 L392 28 L430 14 L478 30 L512 22 L560 34 L600 16 L646 26 L690 18 L728 32 L770 20 L812 30 L850 14 L896 28 L938 20 L980 34 L1022 16 L1066 28 L1108 18 L1150 30 L1190 20 L1236 32 L1276 16 L1318 28 L1360 20 L1400 30 L1440 22 L1440 48 L0 48 Z"
      />
    </svg>
  );
}
