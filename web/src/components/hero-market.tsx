export function HeroMarket() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,#2a5247_0%,transparent_42%),linear-gradient(125deg,#0f1f1b_0%,#132821_46%,#1a3d34_100%)]" />
      <div className="attention-orb absolute right-[8%] top-[18%] h-56 w-56 rounded-full bg-[radial-gradient(circle,#c47a2c44,transparent_70%)] blur-2xl" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:56px_56px]" />

      {/* Keep the chart on the right so it doesn't sit under the brand type */}
      <svg
        className="absolute inset-y-0 right-0 h-full w-[72%] max-w-none translate-x-[4%] md:w-[68%]"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMaxYMid slice"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7ea894" stopOpacity="0.05" />
            <stop offset="35%" stopColor="#e8c089" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#c47a2c" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="fillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c47a2c" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#c47a2c" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="fadeLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="18%" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <mask id="chartMask">
            <rect width="1200" height="800" fill="url(#fadeLeft)" />
          </mask>
        </defs>

        <g mask="url(#chartMask)">
          <path
            d="M80,620 C220,590 280,500 380,525 C500,555 560,430 660,405 C790,370 860,470 950,360 C1040,250 1100,280 1200,200 L1200,800 L80,800 Z"
            fill="url(#fillGrad)"
          />
          <path
            className="chart-line"
            d="M80,620 C220,590 280,500 380,525 C500,555 560,430 660,405 C790,370 860,470 950,360 C1040,250 1100,280 1200,200"
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          {[
            [660, 405],
            [950, 360],
            [1200, 200],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="12" fill="#c47a2c" opacity="0.16" />
              <circle cx={x} cy={y} r="4.5" fill="#f6e7cf" />
            </g>
          ))}
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-[#0f1f1b] via-[#0f1f1b]/85 to-transparent md:w-[48%]" />
    </div>
  );
}
