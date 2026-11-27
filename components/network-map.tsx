import { DOTS_FAR, DOTS_MID, DOTS_NEAR } from "@/lib/map-dots";

// Mapa das unidades sobre o formato de SP e MG (amostrado do mapa original da Qualilan).
// Pontos mais claros = mais perto de uma unidade.
// As posições das unidades são as mesmas do mapa original.
const hub = { city: "Campinas", x: 737, y: 1077 };
const nodes = [
  { city: "Bauru", x: 407, y: 1103, side: "below" },
  { city: "São Paulo", x: 809, y: 1337, side: "below" },
  { city: "Jacareí", x: 1041, y: 1300, side: "right" },
  { city: "Minas Gerais", x: 1262, y: 640, side: "above" },
] as const;

function route(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - Math.abs(a.x - b.x) * 0.22 - 40;
  return `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`;
}

// Etiqueta em pílula; largura estimada pelo número de letras.
function Pill({ x, y, text, tone = "light" }: { x: number; y: number; text: string; tone?: "light" | "hub" }) {
  const fs = tone === "hub" ? 50 : 42;
  const w = text.length * fs * 0.56 + 56;
  const h = fs + 34;
  return (
    <g transform={`translate(${x - w / 2} ${y - h / 2})`}>
      <rect width={w} height={h} rx={h / 2} fill={tone === "hub" ? "#FF9900" : "#ffffff"} fillOpacity={tone === "hub" ? 1 : 0.12} />
      <text
        x={w / 2}
        y={h / 2 + fs * 0.36}
        textAnchor="middle"
        className={tone === "hub" ? "fill-profundo font-bold" : "fill-white font-semibold"}
        style={{ fontSize: fs }}
      >
        {text}
      </text>
    </g>
  );
}

export function NetworkMap() {
  const labelPos = (n: (typeof nodes)[number]) =>
    n.side === "below" ? { x: n.x, y: n.y + 95 } : n.side === "above" ? { x: n.x, y: n.y - 95 } : { x: n.x + 210, y: n.y };

  return (
    <div>
      <svg
        viewBox="-60 -40 1980 1720"
        role="img"
        aria-label="Mapa de São Paulo e Minas Gerais com as unidades Qualilan: matriz em Campinas ligada a Bauru, São Paulo, Jacareí e Minas Gerais"
        className="h-auto w-full"
      >
        <defs>
          <radialGradient id="hubGlow">
            <stop offset="0%" stopColor="#FF9900" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FF9900" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Formato dos estados em pontos, em três intensidades */}
        <path d={DOTS_FAR} stroke="#ffffff" strokeOpacity="0.1" strokeWidth="17" strokeLinecap="round" />
        <path d={DOTS_MID} stroke="#ffffff" strokeOpacity="0.22" strokeWidth="18" strokeLinecap="round" />
        <path d={DOTS_NEAR} stroke="#8EA2FF" strokeOpacity="0.55" strokeWidth="19" strokeLinecap="round" />

        <circle cx={hub.x} cy={hub.y} r="260" fill="url(#hubGlow)" className="q-glow-svg" />

        {/* Rotas e "entregas" saindo da matriz */}
        {nodes.map((n, i) => {
          const d = route(hub, n);
          return (
            <g key={n.city}>
              <path d={d} fill="none" stroke="#FF9900" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" />
              <path d={d} fill="none" stroke="#FF9900" strokeWidth="6" strokeLinecap="round" className="flow-lg" />
              <circle r="13" fill="#FFCC4D" className="packet">
                <animateMotion dur={`${2.6 + i * 0.5}s`} begin={`${i * 0.7}s`} repeatCount="indefinite" path={d} />
              </circle>
            </g>
          );
        })}

        {nodes.map((n, i) => {
          const l = labelPos(n);
          return (
            <g key={n.city}>
              <circle cx={n.x} cy={n.y} r="46" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="4" className="node-ping" style={{ animationDelay: `${i * 0.6}s` }} />
              <circle cx={n.x} cy={n.y} r="22" fill="#121744" stroke="#ffffff" strokeWidth="7" />
              <Pill x={l.x} y={l.y} text={n.city} />
            </g>
          );
        })}

        <circle cx={hub.x} cy={hub.y} r="70" fill="none" stroke="#FF9900" strokeOpacity="0.8" strokeWidth="5" className="node-ping" />
        <circle cx={hub.x} cy={hub.y} r="36" fill="#FF9900" />
        <circle cx={hub.x} cy={hub.y} r="14" fill="#121744" />
        <Pill x={hub.x - 60} y={hub.y - 150} text="Campinas, Matriz" tone="hub" />
      </svg>

      <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2 px-2 text-xs text-white/65">
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-laranja" /> Matriz
        </li>
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-full border-2 border-white bg-profundo" /> Unidade com estoque
        </li>
        <li className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#8EA2FF]" /> Perto de uma unidade
        </li>
      </ul>
    </div>
  );
}
