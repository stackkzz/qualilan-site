import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BrandPills } from "@/components/brand-pills";
import { BrandFilter, CatalogHeader, CatalogSearch, CategoryNav } from "@/components/category-nav";
import { ProductListing } from "@/components/product-listing";
import { brandCounts, getCategory, getProducts, parseSort, searchProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Catálogo | Qualilan",
  description: "Cabeamento, fibra óptica, switches, wireless, CFTV e controle de acesso. Monte sua lista e peça orçamento pelo WhatsApp.",
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

async function Catalog({ searchParams }: { searchParams: PageProps<"/catalogo">["searchParams"] }) {
  const sp = await searchParams;
  const q = one(sp.q);
  const categoria = one(sp.categoria);
  const marca = one(sp.marca);

  const base = searchProducts(await getProducts(), { q, categoria });
  const list = marca ? base.filter((p) => p.brand === marca) : base;
  const sort = parseSort(one(sp.ordem));
  const cat = categoria ? getCategory(categoria) : undefined;
  const brands = brandCounts(base);

  const hrefFor = (b?: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categoria) params.set("categoria", categoria);
    if (b) params.set("marca", b);
    return `/catalogo?${params}`;
  };

  const title = q ? `Resultados para “${q}”` : marca ? `${cat?.name ?? "Produtos"} ${marca}` : (cat?.name ?? "Todos os produtos");

  return (
    <>
      <CatalogHeader
        title={title}
        count={list.length}
        crumb={cat ? { label: cat.name, href: `/catalogo/${cat.slug}` } : undefined}
        search={<CatalogSearch defaultValue={q} categoria={categoria} />}
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 lg:grid-cols-[230px_1fr]">
        <aside className="min-w-0">
          <CategoryNav active={categoria} />
          <BrandFilter brands={brands} active={marca} hrefFor={hrefFor} />
        </aside>
        <section className="min-w-0">
          <BrandPills brands={brands.map((b) => b.name)} active={marca} hrefFor={hrefFor} />
          <ProductListing
            products={list}
            base="/catalogo"
            params={{ q, categoria, marca }}
            sort={sort}
            page={one(sp.pagina)}
            empty={
              <div className="rounded-2xl border border-profundo/10 bg-white px-6 py-16 text-center">
                <span className="icon text-5xl! text-royal/40">search</span>
                <p className="mt-3 text-lg font-semibold text-profundo">Nenhum produto encontrado.</p>
                <p className="mt-2 text-marinho/60">
                  Tente outro termo ou fale com a gente: temos itens que ainda não estão no catálogo.
                </p>
                <Link href="/catalogo" className="mt-6 inline-block font-semibold text-royal underline underline-offset-4">
                  Ver todos os produtos
                </Link>
              </div>
            }
          />
        </section>
      </div>
    </>
  );
}

export default function CatalogPage({ searchParams }: PageProps<"/catalogo">) {
  return (
    <Suspense fallback={<div className="h-screen" />}>
      <Catalog searchParams={searchParams} />
    </Suspense>
  );
}
