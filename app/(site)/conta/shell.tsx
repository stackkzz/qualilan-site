import Link from "next/link";
import type { ReactNode } from "react";
import { FiberLines } from "@/components/fiber-lines";

// Molde das telas de conta: faixa azul do site (a mesma do blog) e o conteúdo subindo por cima dela.
export function AccountShell({
  title,
  intro,
  aside,
  back,
  children,
  width = "max-w-6xl",
}: {
  title: ReactNode;
  intro?: ReactNode;
  aside?: ReactNode;
  back?: { href: string; label: string };
  children: ReactNode;
  width?: string;
}) {
  return (
    <main className="flex-1 bg-offwhite pb-32 md:pb-20">
      <section className="relative isolate overflow-hidden bg-profundo text-white">
        <div aria-hidden className="tech-grid absolute inset-0 -z-10" />
        <FiberLines className="-z-10 opacity-60" />
        <div className={`mx-auto flex flex-wrap items-end justify-between gap-6 px-5 pb-24 pt-10 md:pb-28 md:pt-14 ${width}`}>
          <div className="max-w-xl">
            {back && (
              <Link href={back.href} className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-white/60 hover:text-white">
                <span aria-hidden className="icon text-lg!">
                  arrow_back
                </span>
                {back.label}
              </Link>
            )}
            <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.02em] md:text-[2.75rem]">{title}</h1>
            {intro && <div className="mt-3 text-[17px] leading-relaxed text-white/70">{intro}</div>}
          </div>
          {aside}
        </div>
      </section>
      <div className={`relative mx-auto -mt-16 px-5 ${width}`}>{children}</div>
    </main>
  );
}

export const panel = "rounded-xl bg-white p-6 shadow-[0_1px_2px_rgba(18,23,68,0.06),0_12px_32px_-12px_rgba(18,23,68,0.18)] md:p-8";

// Telas de entrada (entrar, criar conta, esqueci, nova senha): cartão do formulário à esquerda e apoio à direita.
export function AuthScreen({ card, side, wide }: { card: ReactNode; side: ReactNode; wide?: boolean }) {
  return (
    <div className={`grid items-start gap-10 md:gap-14 ${wide ? "md:grid-cols-[minmax(0,560px)_1fr]" : "md:grid-cols-[minmax(0,420px)_1fr]"}`}>
      <section className={panel}>{card}</section>
      <aside className="md:pt-24">{side}</aside>
    </div>
  );
}

const perks = [
  { icon: "history", title: "Histórico de orçamentos", text: "Tudo o que você pediu, pelo WhatsApp ou por e-mail, num lugar só." },
  { icon: "replay", title: "Pedir de novo", text: "Os itens de um orçamento antigo voltam para a lista em um clique." },
  { icon: "badge", title: "Cadastro salvo", text: "O pedido por e-mail já vem preenchido com os dados da empresa." },
];

export function Perks({ title, intro }: { title: string; intro: string }) {
  return (
    <>
      <h2 className="text-xl font-bold text-profundo">{title}</h2>
      <p className="mt-1 text-marinho/65">{intro}</p>
      <ul className="mt-7 space-y-6">
        {perks.map((p) => (
          <li key={p.icon} className="flex gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-md bg-royal/10 text-royal">
              <span aria-hidden className="icon">
                {p.icon}
              </span>
            </span>
            <span>
              <span className="block font-semibold text-profundo">{p.title}</span>
              <span className="mt-0.5 block text-sm leading-relaxed text-marinho/65">{p.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

// Só caminhos internos: o "next" vem da URL.
export const safeNext = (v: unknown) => (typeof v === "string" && v.startsWith("/") && !v.startsWith("//") ? v : undefined);
