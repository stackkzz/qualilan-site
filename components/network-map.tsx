import { DOTS_FAR, DOTS_MID, DOTS_NEAR } from "@/lib/map-dots";

// Mapa das unidades sobre o formato de SP e MG (amostrado do mapa original da Qualilan).
// Posições REAIS: latitude/longitude de cada cidade projetadas no desenho, calibrado pelos extremos dos estados
// (oeste de SP -53,11; leste de MG -39,86; norte de MG -14,23; sul de SP -25,31). Erro esperado: poucos km.
// Pontos mais claros = mais perto de uma unidade.
// O enquadramento aproxima a região das unidades (leste de SP e sul de MG); as bordas esmaecem.
const hub = { city: "Campinas", x: 838, y: 1284 };
const nodes = [
  { city: "Bauru", x: 551, y: 1198, lx: 470, ly: 1290 },
  { city: "São Paulo", x: 899, y: 1380, lx: 860, ly: 1478 },
  { city: "Jacareí", x: 994, y: 1343, lx: 1170, ly: 1395 },
  { city: "Minas Gerais", x: 1031, y: 1187, lx: 1130, ly: 1090 },
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
  return (
    <svg
        viewBox="300 930 1060 680"
        role="img"
        aria-label="Mapa de São Paulo e Minas Gerais com as unidades Qualilan: matriz em Campinas ligada a Bauru, São Paulo, Jacareí e Minas Gerais"
        className="h-auto w-full [mask-image:radial-gradient(ellipse_at_center,black_62%,transparent_100%)]"
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
                <animateMotion dur={`${2.6 + i * 0.5}s`} begin={`-${i * 0.7}s`} repeatCount="indefinite" path={d} />
              </circle>
            </g>
          );
        })}

        {nodes.map((n, i) => {
          return (
            <g key={n.city}>
              <circle cx={n.x} cy={n.y} r="46" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="4" className="node-ping" style={{ animationDelay: `${i * 0.6}s` }} />
              <circle cx={n.x} cy={n.y} r="22" fill="#121744" stroke="#ffffff" strokeWidth="7" />
              <Pill x={n.lx} y={n.ly} text={n.city} />
            </g>
          );
        })}

        <circle cx={hub.x} cy={hub.y} r="70" fill="none" stroke="#FF9900" strokeOpacity="0.8" strokeWidth="5" className="node-ping" />
        <circle cx={hub.x} cy={hub.y} r="36" fill="#FF9900" />
        <circle cx={hub.x} cy={hub.y} r="14" fill="#121744" />
        <Pill x={hub.x - 60} y={hub.y - 120} text="Campinas" tone="hub" />
      </svg>
  );
}
