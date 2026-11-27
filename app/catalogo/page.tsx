import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CatalogSearch, CategoryNav } from "@/components/category-nav";
import { ProductGrid } from "@/components/product-card";
import { brandLabel, brandsOf, getCategory, searchProducts, sortForDisplay } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Catálogo | Qualilan",
  description: "Cabeamento, fibra óptica, switches, wireless, CFTV e controle de acesso. Monte sua lista e peça orçamento pelo WhatsApp.",
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

async function Results({ searchParams }: { searchParams: PageProps<"/catalogo">["searchParams"] }) {
  const sp = await searchParams;
  const q = one(sp.q);
  const categoria = one(sp.categoria);
  const marca = one(sp.marca);

  const base = searchProducts({ q, categoria });
  const list = sortForDisplay(marca ? base.filter((p) => p.brand === marca) : base);
  const cat = categoria ? getCategory(categoria) : undefined;

  const filterHref = (b?: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categoria) params.set("categoria", categoria);
    if (b) params.set("marca", b);
    return `/catalogo?${params}`;
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-profundo md:text-4xl">
            {q ? `Resultados para “${q}”` : (cat?.name ?? "Todos os produtos")}
          </h1>
          <p className="mt-2 text-marinho/60">
            {list.length} {list.length === 1 ? "produto" : "produtos"}
            {q && cat ? ` em ${cat.name}` : ""}
          </p>
        </div>
        <CatalogSearch defaultValue={q} categoria={categoria} />
      </div>

      {brandsOf(base).length > 1 && (
        <ul className="mb-6 flex flex-wrap gap-2 text-sm" aria-label="Filtrar por marca">
          {[undefined, ...brandsOf(base)].map((b) => {
            const active = b === marca;
            return (
              <li key={b ?? "todas"}>
                <Link
                  href={filterHref(b)}
                  aria-current={active ? "true" : undefined}
                  className={`inline-block rounded-full px-4 py-1.5 transition-colors ${
                    active ? "bg-royal text-white" : "border border-profundo/15 bg-white hover:border-royal"
                  }`}
                >
                  {b ? brandLabel(b) : "Todas as marcas"}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {list.length ? (
        <ProductGrid products={list} />
      ) : (
        <div className="rounded-2xl bg-white px-6 py-16 text-center">
          <p className="text-lg font-semibold text-profundo">Nenhum produto encontrado.</p>
          <p className="mt-2 text-marinho/60">
            Tente outro termo ou fale com a gente: temos itens que ainda não estão no catálogo.
          </p>
          <Link href="/catalogo" className="mt-6 inline-block font-semibold text-royal underline underline-offset-4">
            Ver todos os produtos
          </Link>
        </div>
      )}
    </>
  );
}

export default function CatalogPage({ searchParams }: PageProps<"/catalogo">) {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 lg:grid-cols-[220px_1fr] lg:py-14">
      <aside className="min-w-0">
        <CategoryNav />
      </aside>
      <section className="min-w-0">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-white" />}>
          <Results searchParams={searchParams} />
        </Suspense>
      </section>
    </div>
  );
}
