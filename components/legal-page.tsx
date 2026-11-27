import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/lib/site";

export const legalPages = [
  { label: "Privacidade", href: "/privacidade" },
  { label: "Termos de uso", href: "/termos-de-uso" },
  { label: "Envio e entrega", href: "/politica-de-envio" },
  { label: "Trocas e devoluções", href: "/trocas-e-devolucoes" },
];

// Moldura comum das páginas de políticas: título, CNPJ, texto e navegação entre as outras políticas.
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-2xl px-5 py-16 leading-relaxed text-marinho/80 md:py-24 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-profundo [&_li]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-royal [&_a]:underline [&_a]:underline-offset-4">
      <h1 className="text-3xl font-bold tracking-tight text-profundo md:text-4xl">{title}</h1>
      <p className="mt-4 text-sm text-marinho/50">Qualilan, CNPJ {site.cnpj}</p>
      {children}
      <nav aria-label="Outras políticas" className="mt-14 border-t border-profundo/10 pt-6">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm list-none! pl-0!">
          {legalPages
            .filter((p) => p.label !== title)
            .map((p) => (
              <li key={p.href} className="mt-0!">
                <Link href={p.href}>{p.label}</Link>
              </li>
            ))}
        </ul>
      </nav>
    </article>
  );
}
