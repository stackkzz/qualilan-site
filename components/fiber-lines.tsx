// Fundo decorativo: "fibras ópticas" cruzando a seção, com pulsos de luz correndo por elas.
// Só SVG + CSS (classe .fiber-pulse no globals.css); sem movimento para quem pede menos animação.
const paths = [
  "M-50,430 C250,390 420,130 760,190 S1100,330 1260,100",
  "M-50,530 C300,550 520,310 820,340 S1120,490 1260,390",
  "M-50,210 C200,250 380,70 640,100 S1000,50 1260,170",
];

const tones = {
  brand: { from: "#8EA2FF", to: "#FF9900", pulse: "#FFCC4D" },
  green: { from: "#7DDB8E", to: "#8EA2FF", pulse: "#C8F5D0" },
};

export function FiberLines({ tone = "brand", className = "" }: { tone?: keyof typeof tones; className?: string }) {
  const t = tones[tone];
  const id = `fiber-${tone}`;
  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={`pointer-events-none absolute inset-0 size-full [mask-image:radial-gradient(ellipse_at_62%_45%,black_40%,transparent_88%)] ${className}`}
    >
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          <stop offset="0%" stopColor={t.from} stopOpacity="0" />
          <stop offset="45%" stopColor={t.from} stopOpacity="0.85" />
          <stop offset="100%" stopColor={t.to} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {paths.map((d, i) => (
        <g key={d}>
          <path d={d} fill="none" stroke={`url(#${id})`} strokeWidth="2" />
          <path
            d={d}
            pathLength={1000}
            fill="none"
            stroke={t.pulse}
            strokeWidth="4"
            strokeLinecap="round"
            className="fiber-pulse"
            style={{ animationDuration: `${7 + i * 2}s`, animationDelay: `-${i * 2.5}s`, filter: `drop-shadow(0 0 6px ${t.pulse})` }}
          />
        </g>
      ))}
    </svg>
  );
}
