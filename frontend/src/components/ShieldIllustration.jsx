export default function ShieldIllustration() {
  return (
    <svg
      viewBox="0 0 300 300"
      role="img"
      aria-label="Illustration of a shield protecting an account"
      style={{ width: "100%", height: "auto", maxWidth: 260 }}
    >
      <defs>
        <style>{`
          .shield-body {
            animation: settle 2.6s ease-in-out infinite;
            transform-origin: 150px 160px;
          }
          @keyframes settle {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
          }
          .check-mark {
            stroke-dasharray: 60;
            stroke-dashoffset: 60;
            animation: draw-check 2.6s ease-in-out infinite;
          }
          @keyframes draw-check {
            0% { stroke-dashoffset: 60; }
            40% { stroke-dashoffset: 0; }
            80% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            .shield-body, .check-mark { animation: none; }
          }
        `}</style>
      </defs>

      <ellipse cx="150" cy="230" rx="110" ry="18" fill="#ECE6D8" />

      <g className="shield-body">
        <path
          d="M150 40
             L225 68
             L225 145
             C225 195, 190 225, 150 245
             C110 225, 75 195, 75 145
             L75 68
             Z"
          fill="#1F6F6B"
        />
        <path
          d="M150 55
             L211 79
             L211 145
             C211 187, 182 212, 150 229
             C118 212, 89 187, 89 145
             L89 79
             Z"
          fill="#E8F1F0"
        />
      </g>

      <polyline
        className="check-mark"
        points="120,140 143,163 185,110"
        fill="none"
        stroke="#E2543F"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="60" cy="90" r="5" fill="#1F6F6B" opacity="0.4" />
      <circle cx="245" cy="180" r="6" fill="#E2543F" opacity="0.3" />
    </svg>
  );
}
