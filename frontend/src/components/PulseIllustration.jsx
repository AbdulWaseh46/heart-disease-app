export default function PulseIllustration() {
  return (
    <svg
      viewBox="0 0 420 380"
      role="img"
      aria-label="Illustration of a heart with a heartbeat line"
      style={{ width: "100%", height: "auto", maxWidth: 420 }}
    >
      <defs>
        <style>{`
          .pulse-line {
            stroke-dasharray: 620;
            stroke-dashoffset: 620;
            animation: draw 3.2s ease-in-out infinite;
          }
          @keyframes draw {
            0% { stroke-dashoffset: 620; }
            45% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -620; }
          }
          .heart-shape {
            animation: beat 1.8s ease-in-out infinite;
            transform-origin: 210px 190px;
          }
          @keyframes beat {
            0%, 100% { transform: scale(1); }
            15% { transform: scale(1.06); }
            30% { transform: scale(0.99); }
          }
          @media (prefers-reduced-motion: reduce) {
            .pulse-line, .heart-shape { animation: none; }
          }
        `}</style>
      </defs>

      {/* soft background blob */}
      <ellipse cx="210" cy="200" rx="190" ry="170" fill="#ECE6D8" />

      {/* heart shape, slightly hand-drawn / organic */}
      <g className="heart-shape">
        <path
          d="M210 260
             C 130 205, 95 160, 95 118
             C 95 85, 120 62, 150 62
             C 175 62, 197 78, 210 100
             C 223 78, 245 62, 270 62
             C 300 62, 325 85, 325 118
             C 325 160, 290 205, 210 260 Z"
          fill="#E2543F"
        />
      </g>

      {/* heartbeat line running through */}
      <polyline
        className="pulse-line"
        points="30,300 120,300 145,300 165,240 190,340 215,270 235,300 390,300"
        fill="none"
        stroke="#164F4C"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* small decorative dots, hand-placed not grid-aligned */}
      <circle cx="70" cy="120" r="5" fill="#1F6F6B" opacity="0.5" />
      <circle cx="350" cy="150" r="7" fill="#E2543F" opacity="0.35" />
      <circle cx="330" cy="310" r="4" fill="#164F4C" opacity="0.4" />
    </svg>
  );
}
