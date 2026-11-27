import Image from "next/image";

// Carregamento da Qualilan, inspirado no da Zaion: símbolo Q no centro, anel de "fibra" com a luz girando,
// três "pacotes de dados" orbitando e frases do dia a dia da distribuidora trocando embaixo.
// Só CSS/SVG (classes .ql-* no globals.css). Com movimento reduzido, fica parado e mostra só a primeira frase.
const messages = ["Conectando à rede…", "Consultando o estoque…", "Separando os produtos…", "Preparando seu orçamento…"];

const dots = [
  { size: "size-2.5", color: "bg-laranja", duration: "2.4s" },
  { size: "size-2", color: "bg-amarelo", duration: "3.6s" },
  { size: "size-1.5", color: "bg-laranja/70", duration: "5s" },
];

// label: frase fixa no lugar das frases de estoque (ex.: telas de conta).
export function QualilanLoader({ className = "", label }: { className?: string; label?: string }) {
  return (
    <div role="status" aria-live="polite" className={`flex flex-col items-center gap-6 ${className}`}>
      <div aria-hidden className="relative grid size-32 place-items-center">
        {/* Anel: trilho fino + luz percorrendo (mesma espessura do fio) */}
        <svg viewBox="0 0 128 128" className="ql-spin absolute inset-0 size-full">
          <defs>
            <linearGradient id="ql-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF9900" />
              <stop offset="55%" stopColor="#312E7F" />
              <stop offset="100%" stopColor="#312E7F" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle cx="64" cy="64" r="58" fill="none" stroke="#121744" strokeOpacity="0.1" strokeWidth="3" />
          <circle cx="64" cy="64" r="58" fill="none" stroke="url(#ql-ring)" strokeWidth="3" strokeLinecap="round" strokeDasharray="220 145" />
        </svg>

        {dots.map((d) => (
          <span key={d.duration} className="ql-orbit absolute inset-4 flex justify-center" style={{ animationDuration: d.duration }}>
            <span className={`rounded-full ${d.size} ${d.color}`} />
          </span>
        ))}

        {/* Símbolo limpo, sem brilho nem sombra (regra do manual da marca) */}
        <span className="ql-breathe relative grid size-14 place-items-center rounded-full bg-profundo">
          <Image src="/brand/q-branco.png" alt="" width={32} height={33} className="h-auto w-8" />
        </span>
      </div>

      <span className="sr-only">Carregando</span>
      <p aria-hidden className="relative h-6 w-60 text-center text-[15px] font-medium text-profundo">
        {label ? (
          <span className="absolute inset-0">{label}</span>
        ) : (
          messages.map((m, i) => (
            <span key={m} className="ql-msg absolute inset-0" style={{ animationDelay: `${i * 2.2}s` }}>
              {m}
            </span>
          ))
        )}
      </p>
    </div>
  );
}

// Versão de página inteira: centraliza o carregamento na área de conteúdo.
export function PageLoader({ className = "", label }: { className?: string; label?: string }) {
  return (
    <div className={`flex min-h-[60dvh] items-center justify-center ${className}`}>
      <QualilanLoader label={label} />
    </div>
  );
}

// Versão pequena para botões: só o anel girando.
export function SpinnerRing({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={`ql-spin ${className}`}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="34 23" />
    </svg>
  );
}
