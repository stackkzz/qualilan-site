import Link from "next/link";
import type { ReactNode } from "react";

// Mini-telas que ilustram cada passo. São só marcação estática: a "animação" é CSS.
function SearchMock() {
  return (
    <div className="rounded-xl border border-profundo/10 bg-offwhite p-3" aria-hidden>
      <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 shadow-sm">
        <span className="icon text-lg! text-marinho/40">search</span>
        <span className="typing inline-block w-[16ch] overflow-hidden whitespace-nowrap border-r-2 border-royal text-sm text-profundo">
          patch cord cat6
        </span>
      </div>
      {["Patch cord Gigalan Green Cat.6 5 m azul", "Patch cord Gigalan Green Cat.6 3 m vermelho"].map((name) => (
        <div key={name} className="mt-2 flex items-center gap-3 rounded-lg bg-white p-2">
          <span className="grid size-9 place-items-center rounded-md bg-royal/8 text-royal">
            <span className="icon text-lg!">cable</span>
          </span>
          <span className="text-xs">
            <span className="block font-medium text-profundo">{name}</span>
            <span className="text-marinho/50">Lightera</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function ListMock() {
  const items = [
    { name: "Patch cord Gigalan Green Cat.6 5 m", qty: 20 },
    { name: "Switch TP-Link 8 portas (4 PoE)", qty: 2 },
    { name: "Câmera bullet Full HD", qty: 8 },
  ];
  return (
    <div className="rounded-xl border border-profundo/10 bg-offwhite p-3" aria-hidden>
      <div className="mb-2 flex items-center justify-between px-1 text-xs font-semibold text-profundo">
        Sua lista
        <span className="rounded-full bg-profundo px-2 py-0.5 text-white">30 itens</span>
      </div>
      {items.map((i) => (
        <div key={i.name} className="mt-1.5 flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs">
          <span className="font-medium text-profundo">{i.name}</span>
          <span className="rounded-md border border-profundo/15 px-2 py-0.5 tabular-nums text-marinho/70">{i.qty}</span>
        </div>
      ))}
    </div>
  );
}

function WhatsAppMock() {
  return (
    <div className="overflow-hidden rounded-xl border border-profundo/10 bg-[#efeae2]" aria-hidden>
      <div className="flex items-center gap-2 bg-[#075e54] px-3 py-2 text-xs text-white">
        <span className="grid size-7 place-items-center rounded-full bg-white/15 font-bold">Q</span>
        <span>
          <span className="block font-semibold">Qualilan Vendas</span>
          <span className="flex items-center gap-1.5 text-white/75">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full rounded-full bg-[#25d366] opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[#25d366]" />
            </span>
            online
          </span>
        </span>
      </div>
      <div className="p-3">
        <div className="ml-auto max-w-[90%] rounded-lg rounded-tr-none bg-[#d9fdd3] px-3 py-2 text-xs leading-relaxed text-[#111b21] shadow-sm">
          Olá, Qualilan! Gostaria de um orçamento destes itens:
          <br />• 20x Patch cord Gigalan Green Cat.6 5 m
          <br />• 2x Switch TP-Link 8 portas (4 PoE)
          <br />• 8x Câmera bullet Full HD
          <span className="mt-1 flex items-center justify-end gap-0.5 text-[10px] text-[#667781]">
            09:41 <span className="icon text-sm! text-[#53bdeb]">done_all</span>
          </span>
        </div>
      </div>
    </div>
  );
}

const steps: { title: string; text: string; mock: ReactNode }[] = [
  { title: "Encontre os produtos", text: "Busque por nome, marca ou código no catálogo.", mock: <SearchMock /> },
  { title: "Monte sua lista", text: "Adicione os itens e as quantidades de que precisa. A lista fica salva no seu navegador.", mock: <ListMock /> },
  { title: "Envie pelo WhatsApp", text: "A mensagem vai pronta para o nosso time de vendas, que responde com a cotação.", mock: <WhatsAppMock /> },
];

function StepCard({ i, title, text, mock }: { i: number; title: string; text: string; mock: ReactNode }) {
  return (
    <div className="grid items-center gap-6 rounded-2xl bg-white p-6 md:grid-cols-2 md:p-8">
      <div>
        {/* O número do passo já está no círculo da linha do tempo */}
        <h3 className="text-xl font-bold tracking-tight text-profundo md:text-2xl">
          <span className="sr-only">Passo {i + 1}: </span>{title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-marinho/65">{text}</p>
      </div>
      {/* A tela de exemplo só aparece a partir do tablet: no celular o passo vira texto simples */}
      <div className="hidden md:block">{mock}</div>
    </div>
  );
}

export function QuoteSteps() {
  return (
    <section className="bg-offwhite py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-profundo md:text-[2.5rem] md:leading-[1.1]">
            Orçamento sem cadastro, direto no WhatsApp
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-marinho/65">
            Sem carrinho e sem login. Você monta a lista no site e conversa com quem vai atender o seu pedido.
          </p>
          <Link
            href="/catalogo"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-profundo px-6 py-3.5 font-semibold text-white transition-colors hover:bg-royal"
          >
            <span className="icon text-xl!">search</span>
            Começar pelo catálogo
          </Link>
        </div>

        <div className="relative">
          {/* Trilho da linha do tempo; o preenchimento cresce com a rolagem. */}
          <div aria-hidden className="absolute bottom-10 left-[19px] top-10 w-0.5 rounded-full bg-profundo/10">
            <div className="rail-fill h-full w-full origin-top rounded-full bg-gradient-to-b from-laranja to-royal" />
          </div>
          <ol className="space-y-8">
            {steps.map((s, i) => {
              const last = i === steps.length - 1;
              return (
                <li key={s.title} className="relative pl-14">
                  <span
                    aria-hidden
                    className="step-dot absolute left-0 top-8 grid size-10 place-items-center rounded-full border-2 border-profundo/15 bg-white text-sm font-bold text-profundo/40"
                  >
                    {i + 1}
                  </span>
                  {last ? (
                    <div className="relative overflow-hidden rounded-2xl p-[2px]">
                      <span
                        aria-hidden
                        className="spin-border absolute left-1/2 top-1/2 -z-0 aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_250deg,#FF9900_300deg,#312E7F_340deg,transparent_360deg)]"
                      />
                      <div className="relative rounded-[14px]">
                        <StepCard i={i} {...s} />
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-profundo/10">
                      <StepCard i={i} {...s} />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
