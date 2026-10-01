export function HeroMarket() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_30%,#1e3a5f_0%,transparent_42%),linear-gradient(128deg,#07101c_0%,#0a1628_44%,#12263f_100%)]" />

      <div className="attention-orb absolute right-[10%] top-[16%] h-64 w-64 rounded-full bg-[radial-gradient(circle,#c4a35a55,transparent_70%)] blur-2xl" />
      <div className="absolute left-[8%] top-[42%] h-40 w-40 rounded-full bg-[radial-gradient(circle,#0d8a6f33,transparent_70%)] blur-xl" />

      <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* Concentric brand circles — full-bleed visual plane */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="ringGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c4a35a" stopOpacity="0.05" />
            <stop offset="55%" stopColor="#e8d19a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#c4a35a" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7a93ad" stopOpacity="0.05" />
            <stop offset="40%" stopColor="#e8d19a" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#c4a35a" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="fillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c4a35a" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#c4a35a" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g className="orbit-ring" opacity="0.55">
          <circle
            cx="980"
            cy="380"
            r="210"
            fill="none"
            stroke="url(#ringGold)"
            strokeWidth="1.2"
          />
          <circle
            cx="980"
            cy="380"
            r="150"
            fill="none"
            stroke="#c4a35a"
            strokeOpacity="0.28"
            strokeWidth="1"
          />
          <circle
            cx="980"
            cy="380"
            r="92"
            fill="none"
            stroke="#e8d19a"
            strokeOpacity="0.4"
            strokeWidth="1.4"
          />
          <circle cx="980" cy="170" r="3.5" fill="#e8d19a" />
        </g>

        <path
          d="M620,640 C740,600 820,520 900,540 C1000,565 1060,450 1140,420 C1230,385 1300,470 1380,360 C1440,290 1440,290 1440,290 L1440,900 L620,900 Z"
          fill="url(#fillGrad)"
        />
        <path
          className="chart-line"
          d="M620,640 C740,600 820,520 900,540 C1000,565 1060,450 1140,420 C1230,385 1300,470 1380,360 C1440,290 1440,290 1440,290"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-[#07101c] via-[#07101c]/88 to-transparent md:w-[50%]" />
    </div>
  );
}
