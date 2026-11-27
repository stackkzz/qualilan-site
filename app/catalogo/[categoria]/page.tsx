import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CatalogSearch, CategoryNav } from "@/components/category-nav";
import { ProductGrid } from "@/components/product-card";
import { brandLabel, brandsOf, getCategory, products, sortForDisplay } from "@/lib/catalog";
import { categories, whatsappLink } from "@/lib/site";

export function generateStaticParams() {
  return categories.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/catalogo/[categoria]">): Promise<Metadata> {
  const cat = getCategory((await params).categoria);
  return cat
    ? { title: `${cat.name} | Catálogo Qualilan`, description: `${cat.name} das principais marcas, com pronta entrega. Peça orçamento pelo WhatsApp.` }
    : {};
}

// Leitura de params dentro de Suspense: exigência da navegação instantânea (Cache Components).
export default function CategoryPage({ params }: PageProps<"/catalogo/[categoria]">) {
  return (
    <Suspense fallback={<div className="mx-auto h-screen max-w-6xl" />}>
      <CategoryPageContent params={params} />
    </Suspense>
  );
}

async function CategoryPageContent({ params }: { params: PageProps<"/catalogo/[categoria]">["params"] }) {
  const { categoria } = await params;
  const cat = getCategory(categoria);
  if (!cat) notFound();

  const list = sortForDisplay(products.filter((p) => p.category === categoria));
  const brands = brandsOf(list);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 lg:grid-cols-[220px_1fr] lg:py-14">
      <aside className="min-w-0">
        <CategoryNav active={categoria} />
      </aside>
      <section className="min-w-0">
        <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-profundo md:text-4xl">{cat.name}</h1>
            <p className="mt-2 text-marinho/60">
              {list.length} {list.length === 1 ? "produto" : "produtos"}
            </p>
          </div>
          <CatalogSearch categoria={categoria} />
        </div>

        {brands.length > 1 && (
          <ul className="mb-6 flex flex-wrap gap-2 text-sm" aria-label="Filtrar por marca">
            {brands.map((b) => (
              <li key={b}>
                <Link
                  href={`/catalogo?categoria=${categoria}&marca=${encodeURIComponent(b)}`}
                  className="inline-block rounded-full border border-profundo/15 bg-white px-4 py-1.5 transition-colors hover:border-royal"
                >
                  {brandLabel(b)}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {list.length ? (
          <ProductGrid products={list} />
        ) : (
          <div className="rounded-2xl bg-white px-6 py-16 text-center">
            <p className="text-lg font-semibold text-profundo">Os produtos desta categoria estão sendo cadastrados.</p>
            <p className="mt-2 text-marinho/60">Fale com a gente para saber o que temos em estoque.</p>
            <a
              href={whatsappLink(`Olá, Qualilan! Gostaria de um orçamento de ${cat.name.toLowerCase()}.`)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-laranja px-6 py-3 font-semibold text-profundo hover:bg-amarelo"
            >
              <span className="icon text-xl!">chat</span>
              Pedir orçamento de {cat.name.toLowerCase()}
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
