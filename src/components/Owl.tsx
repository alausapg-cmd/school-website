import type { SVGProps } from "react";

type OwlProps = SVGProps<SVGSVGElement> & { hat?: boolean; blink?: boolean; wave?: boolean; book?: boolean };

// Professor Hoot, the Owlberry mascot: a wise purple owl in a graduation cap.
export function Owl({ hat = true, blink = true, wave = false, book = false, className = "", ...rest }: OwlProps) {
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden {...rest}>
      {/* ear tufts */}
      <path d="M52 64 L36 16 L84 48 Z" fill="#4E1F6B" />
      <path d="M148 64 L164 16 L116 48 Z" fill="#4E1F6B" />
      {/* body */}
      <ellipse cx="100" cy="128" rx="72" ry="84" fill="#6A2C91" />
      <ellipse cx="100" cy="152" rx="46" ry="54" fill="#EBDDF5" />
      <path d="M72 136 q7 9 14 0 q7 9 14 0 q7 9 14 0 q7 9 14 0 M78 156 q7 9 14 0 q7 9 14 0 q7 9 14 0 M84 176 q8 9 16 0 q8 9 16 0" fill="none" stroke="#BC93D6" strokeWidth="3" strokeLinecap="round" />
      {/* wings */}
      {wave ? (
        <g className="origin-stem animate-sway">
          <path d="M168 120 C 196 96, 200 66, 186 50 C 176 74, 166 92, 150 108 Z" fill="#4E1F6B" />
        </g>
      ) : (
        <path d="M170 112 C 190 148, 176 188, 146 196 C 158 166, 158 136, 170 112 Z" fill="#4E1F6B" />
      )}
      <path d="M30 112 C 10 148, 24 188, 54 196 C 42 166, 42 136, 30 112 Z" fill="#4E1F6B" />
      {book && (
        <g>
          <path d="M62 170 L100 160 L138 170 L138 204 L100 194 L62 204 Z" fill="#C2185B" />
          <path d="M100 160 L100 194" stroke="#7D0F3A" strokeWidth="3" />
          <path d="M70 176 l22 -5 M70 186 l22 -5 M108 171 l22 5 M108 181 l22 5" stroke="#FBE1EC" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}
      {/* eyes */}
      <circle cx="72" cy="92" r="31" fill="#FFF6DD" stroke="#FFB320" strokeWidth="6" />
      <circle cx="128" cy="92" r="31" fill="#FFF6DD" stroke="#FFB320" strokeWidth="6" />
      <circle cx="75" cy="95" r="14" fill="#2A1C12" />
      <circle cx="125" cy="95" r="14" fill="#2A1C12" />
      <circle cx="80" cy="89" r="4.5" fill="#fff" />
      <circle cx="130" cy="89" r="4.5" fill="#fff" />
      {blink && (
        <>
          <circle cx="72" cy="92" r="34" fill="#6A2C91" className="origin-hang animate-blink" />
          <circle cx="128" cy="92" r="34" fill="#6A2C91" className="origin-hang animate-blink" />
        </>
      )}
      {/* cheeks and beak */}
      <circle cx="50" cy="126" r="8" fill="#F06BA0" opacity="0.55" />
      <circle cx="150" cy="126" r="8" fill="#F06BA0" opacity="0.55" />
      <path d="M90 112 L110 112 L100 132 Z" fill="#FFB320" stroke="#B87800" strokeWidth="2" strokeLinejoin="round" />
      {/* feet */}
      <g fill="#FFB320">
        <ellipse cx="78" cy="211" rx="14" ry="7" />
        <ellipse cx="122" cy="211" rx="14" ry="7" />
      </g>
      {hat && (
        <g>
          <path d="M60 52 Q100 34 140 52 L140 66 Q100 50 60 66 Z" fill="#2A1C12" />
          <polygon points="100,10 166,32 100,54 34,32" fill="#3B2818" />
          <polygon points="100,10 166,32 100,40 34,32" fill="#4A3320" />
          <g className="origin-hang animate-swing">
            <path d="M100 32 L156 40 L156 66" fill="none" stroke="#FFB320" strokeWidth="3.5" strokeLinecap="round" />
            <rect x="150" y="62" width="12" height="14" rx="3" fill="#FFB320" />
          </g>
          <circle cx="100" cy="32" r="4.5" fill="#FFB320" />
        </g>
      )}
    </svg>
  );
}

// Small owl-face badge used as the school's mark (logo, favicon, report card).
export function OwlMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="31" fill="#1D6B42" />
      <path d="M32 3 C 20 8, 14 16, 16 24 C 24 20, 30 12, 32 3 Z" fill="#7CC24A" />
      <path d="M32 3 C 44 8, 50 16, 48 24 C 40 20, 34 12, 32 3 Z" fill="#3A8A2E" />
      <path d="M17 26 L13 13 L25 21 Z M47 26 L51 13 L39 21 Z" fill="#4E1F6B" />
      <ellipse cx="32" cy="38" rx="19" ry="20" fill="#6A2C91" />
      <ellipse cx="32" cy="46" rx="11" ry="10" fill="#EBDDF5" />
      <circle cx="25" cy="32" r="7.5" fill="#FFF6DD" stroke="#FFB320" strokeWidth="2" />
      <circle cx="39" cy="32" r="7.5" fill="#FFF6DD" stroke="#FFB320" strokeWidth="2" />
      <circle cx="25.5" cy="33" r="3.6" fill="#2A1C12" />
      <circle cx="38.5" cy="33" r="3.6" fill="#2A1C12" />
      <circle cx="27" cy="31.5" r="1.2" fill="#fff" />
      <circle cx="40" cy="31.5" r="1.2" fill="#fff" />
      <path d="M29.5 38 L34.5 38 L32 43 Z" fill="#FFB320" />
      <circle cx="49" cy="50" r="4" fill="#C2185B" />
      <circle cx="54" cy="45" r="3.4" fill="#6A2C91" />
      <circle cx="45" cy="55" r="3" fill="#C2185B" />
    </svg>
  );
}
