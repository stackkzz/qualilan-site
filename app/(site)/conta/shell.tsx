import type { ReactNode } from "react";
import { FiberLines } from "@/components/fiber-lines";

// Faixa azul do topo (a mesma do blog) e o conteúdo da conta subindo por cima dela.
export function AccountShell({ title, intro, aside, children, width = "max-w-6xl" }: {
  title: ReactNode;
  intro?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  width?: string;
}) {
  return (
    <main className="flex-1 bg-offwhite pb-20">
      <section className="relative isolate overflow-hidden bg-profundo text-white">
        <div aria-hidden className="tech-grid absolute inset-0 -z-10" />
        <FiberLines className="-z-10 opacity-60" />
        <div className={`mx-auto flex flex-wrap items-end justify-between gap-6 px-5 pb-24 pt-12 md:pb-28 md:pt-16 ${width}`}>
          <div className="max-w-xl">
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

export const panel = "rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(18,23,68,0.06),0_12px_32px_-12px_rgba(18,23,68,0.18)] md:p-8";
