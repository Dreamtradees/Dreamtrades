export function HeroMarket() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,#2a5247_0%,transparent_40%),linear-gradient(135deg,#21453c_0%,#132821_52%,#0b1815_100%)]" />
      <div className="attention-orb absolute right-[12%] top-[22%] h-52 w-52 rounded-full bg-[radial-gradient(circle,#c47a2c44,transparent_70%)] blur-2xl" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:56px_56px]" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7ea894" stopOpacity="0.15" />
            <stop offset="40%" stopColor="#e8c089" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#c47a2c" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="fillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c47a2c" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#c47a2c" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M0,540 C140,510 200,430 300,455 C410,485 450,365 540,345 C660,320 720,400 800,305 C890,205 960,245 1060,175 C1120,135 1160,150 1200,110 L1200,800 L0,800 Z"
          fill="url(#fillGrad)"
        />
        <path
          className="chart-line"
          d="M0,540 C140,510 200,430 300,455 C410,485 450,365 540,345 C660,320 720,400 800,305 C890,205 960,245 1060,175 C1120,135 1160,150 1200,110"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        {[
          [300, 455],
          [540, 345],
          [800, 305],
          [1060, 175],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="12" fill="#c47a2c" opacity="0.16" />
            <circle cx={x} cy={y} r="4.5" fill="#f6e7cf" />
          </g>
        ))}
      </svg>
    </div>
  );
}
