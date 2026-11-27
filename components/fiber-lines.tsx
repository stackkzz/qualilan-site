// Fundo decorativo: "fibras ópticas" cruzando a seção, com pulsos de luz correndo por elas.
// Só SVG + CSS (classe .fiber-pulse no globals.css); sem movimento para quem pede menos animação.
// Feixe de três cabos em ondas suaves e quase paralelas (curvas simétricas: sem dobras bruscas).
const paths = [
  "M-60,300 C200,230 400,230 600,300 S1000,370 1260,300",
  "M-60,370 C200,300 400,300 600,370 S1000,440 1260,370",
  "M-60,450 C200,385 400,385 600,450 S1000,515 1260,450",
];

const tones = {
  brand: { from: "#8EA2FF", to: "#FF9900", pulse: "#FFCC4D" },
  green: { from: "#7DDB8E", to: "#8EA2FF", pulse: "#C8F5D0" },
};

export function FiberLines({
  tone = "brand",
  className = "",
  masked = true,
}: {
  tone?: keyof typeof tones;
  className?: string;
  masked?: boolean; // false em áreas pequenas (cards), onde a máscara apagaria quase tudo
}) {
  const t = tones[tone];
  const id = `fiber-${tone}`;
  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={`pointer-events-none absolute inset-0 size-full ${masked ? "[mask-image:radial-gradient(ellipse_at_62%_45%,black_40%,transparent_88%)]" : ""} ${className}`}
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
          <path d={d} fill="none" stroke={`url(#${id})`} strokeWidth="1.5" />
          <path
            d={d}
            pathLength={1000}
            fill="none"
            stroke={t.pulse}
            strokeWidth="2"
            strokeLinecap="round"
            className="fiber-pulse"
            style={{ animationDuration: `${7 + i * 2}s`, animationDelay: `-${i * 2.5}s`, filter: `drop-shadow(0 0 3px ${t.pulse})` }}
          />
        </g>
      ))}
    </svg>
  );
}
