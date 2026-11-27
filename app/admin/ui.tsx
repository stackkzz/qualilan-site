import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-lg border border-profundo/20 bg-white px-3 py-2.5 text-marinho outline-none focus:border-royal focus:ring-2 focus:ring-royal/20";

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-profundo">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-marinho/50">{hint}</p>}
    </div>
  );
}

// Topo padrão das telas do painel: título, descrição curta e a ação principal à direita.
export function PageHeader({ title, description, action }: { title: string; description?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-profundo md:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-[15px] text-marinho/60">{description}</p>}
      </div>
      {action}
    </div>
  );
}

// Conteúdo de cada tela: mesma largura e respiro em todas.
export function PageBody({ children }: { children: ReactNode }) {
  return <main className="mx-auto max-w-5xl px-5 py-8 md:px-8 md:py-10">{children}</main>;
}

export const panelCard = "rounded-xl border border-profundo/10 bg-white";

export const primaryButton =
  "inline-flex items-center gap-2 rounded-lg bg-profundo px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-royal";
