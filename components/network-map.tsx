// Mapa de rede das unidades. Posições calculadas da latitude/longitude real de cada cidade
// (x = (lon + 49.6) * 118 + 40, y = (-21.8 - lat) * 118 + 40), então a geografia é fiel, só sem o contorno dos estados.
const hub = { city: "Campinas", label: "Matriz", x: 340, y: 170 };
const nodes = [
  { city: "Bauru", x: 104, y: 100, lx: 0, ly: -24 },
  { city: "São Paulo", x: 390, y: 246, lx: 0, ly: 34 },
  { city: "Jacareí", x: 468, y: 217, lx: 0, ly: 34 },
  { city: "Santa Rita do Sapucaí", x: 500, y: 93, lx: -20, ly: -24 },
];
// Rotas que saem pelas bordas: entregas para o resto do Brasil.
const outbound = [
  { from: nodes[0], to: { x: -20, y: 30 } },
  { from: nodes[0], to: { x: -20, y: 200 } },
  { from: nodes[3], to: { x: 620, y: 20 } },
  { from: nodes[2], to: { x: 620, y: 300 } },
  { from: hub, to: { x: 250, y: 330 } },
];

function curve(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - Math.abs(a.x - b.x) * 0.18;
  return `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`;
}

export function NetworkMap() {
  return (
    <svg
      viewBox="0 0 600 310"
      role="img"
      aria-label="Mapa das unidades Qualilan: matriz em Campinas ligada a Bauru, São Paulo, Jacareí e Santa Rita do Sapucaí, com entregas para todo o Brasil"
      className="h-auto w-full"
    >
      <defs>
        <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#ffffff" fillOpacity="0.09" />
        </pattern>
        <radialGradient id="hubGlow">
          <stop offset="0%" stopColor="#FF9900" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FF9900" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="600" height="310" fill="url(#dots)" />

      {outbound.map((o, i) => (
        <path key={i} d={curve(o.from, o.to)} fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1.5" className="flow flow-slow" />
      ))}

      {nodes.map((n) => (
        <path key={n.city} d={curve(hub, n)} fill="none" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" className="flow" />
      ))}

      <circle cx={hub.x} cy={hub.y} r="70" fill="url(#hubGlow)" className="q-glow-svg" />

      {nodes.map((n, i) => (
        <g key={n.city}>
          <circle cx={n.x} cy={n.y} r="16" fill="none" stroke="#ffffff" strokeOpacity="0.5" className="node-ping" style={{ animationDelay: `${i * 0.6}s` }} />
          <circle cx={n.x} cy={n.y} r="6" fill="#ffffff" />
          <text x={n.x + n.lx} y={n.y + n.ly} textAnchor="middle" className="fill-white text-[17px] font-semibold">
            {n.city}
          </text>
        </g>
      ))}

      <g>
        <circle cx={hub.x} cy={hub.y} r="24" fill="none" stroke="#FF9900" strokeOpacity="0.7" className="node-ping" />
        <circle cx={hub.x} cy={hub.y} r="11" fill="#FF9900" />
        <circle cx={hub.x} cy={hub.y} r="4" fill="#121744" />
        <text x={hub.x - 18} y={hub.y - 22} textAnchor="end" className="fill-white text-[20px] font-bold">
          {hub.city}
        </text>
        <text x={hub.x - 18} y={hub.y - 2} textAnchor="end" className="fill-amarelo text-[14px] font-semibold">
          {hub.label}
        </text>
      </g>

      <text x="590" y="300" textAnchor="end" className="fill-white/50 text-[13px]">
        Entregas para todo o Brasil
      </text>
    </svg>
  );
}
