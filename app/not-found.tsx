import type { Metadata } from "next";
import Link from "next/link";
import { QuoteProvider } from "@/components/quote-cart";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Página não encontrada | Qualilan" };

// Fica fora do grupo (site), então monta o cabeçalho e o rodapé por conta própria.
export default function NotFound() {
  return (
    <QuoteProvider>
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-1 flex-col items-start px-5 py-24 md:py-32">
        <p className="text-sm font-semibold text-royal">Erro 404</p>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.02em] text-profundo md:text-5xl">Página não encontrada</h1>
        <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-marinho/65">
          O endereço pode ter mudado com o novo site. Busque o produto no catálogo ou volte para a página inicial.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/catalogo" className="rounded-lg bg-profundo px-6 py-3.5 font-semibold text-white hover:bg-royal">
            Ir para o catálogo
          </Link>
          <Link href="/" className="rounded-lg border border-profundo/15 px-6 py-3.5 font-semibold text-profundo hover:border-profundo">
            Página inicial
          </Link>
        </div>
      </main>
      <SiteFooter />
    </QuoteProvider>
  );
}
