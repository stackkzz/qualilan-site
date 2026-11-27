// Ilustração de racks de data center com LEDs piscando (classe .led no globals.css). Só SVG + CSS.
const units = Array.from({ length: 7 }, (_, i) => i);

export function RackVisual({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 200" aria-hidden className={`pointer-events-none absolute inset-0 size-full ${className}`} preserveAspectRatio="xMidYMid slice">
      {[90, 200, 310].map((x, r) => (
        <g key={x} transform={`translate(${x} 26)`}>
          <rect width="96" height="170" rx="6" fill="#0B0F33" stroke="#ffffff" strokeOpacity="0.14" />
          {units.map((u) => (
            <g key={u} transform={`translate(8 ${10 + u * 22})`}>
              <rect width="80" height="16" rx="2.5" fill="#ffffff" fillOpacity={u % 3 === 1 ? 0.1 : 0.06} />
              {[0, 1, 2].map((l) => (
                <circle
                  key={l}
                  cx={60 + l * 7}
                  cy="8"
                  r="2"
                  fill={(u + l + r) % 4 === 0 ? "#FF9900" : "#7DDB8E"}
                  className="led"
                  style={{ animationDelay: `${((u * 3 + l + r * 5) % 9) * 0.35}s` }}
                />
              ))}
              <rect x="6" y="6" width={18 + ((u + r) % 3) * 8} height="4" rx="2" fill="#ffffff" fillOpacity="0.18" />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}
