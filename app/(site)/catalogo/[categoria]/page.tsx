import type { Metadata } from "next";
import { WhatsAppIcon, whatsappButtonClass } from "@/components/whatsapp-icon";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BrandPills } from "@/components/brand-pills";
import { BrandFilter, CatalogHeader, CatalogSearch, CategoryNav } from "@/components/category-nav";
import { LighteraNotice } from "@/components/lightera-notice";
import { ProductListing } from "@/components/product-listing";
import { brandCounts, getCategory, getProducts, parseSort } from "@/lib/catalog";
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
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

export default function CategoryPage({ params, searchParams }: PageProps<"/catalogo/[categoria]">) {
  return (
    <Suspense fallback={<div className="mx-auto h-screen max-w-6xl" />}>
      <CategoryPageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function CategoryPageContent({
  params,
  searchParams,
}: {
  params: PageProps<"/catalogo/[categoria]">["params"];
  searchParams: PageProps<"/catalogo/[categoria]">["searchParams"];
}) {
  const { categoria } = await params;
  const cat = getCategory(categoria);
  if (!cat) notFound();

  const sp = await searchParams;
  const list = (await getProducts()).filter((p) => p.category === categoria);
  const brands = brandCounts(list);
  const hrefFor = (b?: string) => (b ? `/catalogo?categoria=${categoria}&marca=${encodeURIComponent(b)}` : `/catalogo/${categoria}`);

  return (
    <>
      <CatalogHeader title={cat.name} count={list.length} search={<CatalogSearch categoria={categoria} />}>
        {brands.some((b) => b.name === "Lightera") && (
          <div className="mt-6">
            <LighteraNotice />
          </div>
        )}
      </CatalogHeader>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 lg:grid-cols-[230px_1fr]">
        <aside className="min-w-0">
          <CategoryNav active={categoria} />
          <BrandFilter brands={brands} hrefFor={hrefFor} />
        </aside>
        <section className="min-w-0">
          <BrandPills brands={brands.map((b) => b.name)} hrefFor={hrefFor} />
          <ProductListing
            products={list}
            base={`/catalogo/${categoria}`}
            params={{}}
            sort={parseSort(one(sp.ordem))}
            page={one(sp.pagina)}
            empty={
            <div className="rounded-2xl border border-profundo/10 bg-white px-6 py-16 text-center">
              <span className="icon text-5xl! text-royal/40">{cat.icon}</span>
              <p className="mt-3 text-lg font-semibold text-profundo">Os produtos desta categoria estão sendo cadastrados.</p>
              <p className="mt-2 text-marinho/60">Fale com a gente para saber o que temos em estoque.</p>
              <a
                href={whatsappLink(`Olá, Qualilan! Gostaria de um orçamento de ${cat.name.toLowerCase()}.`)}
                className={`mt-6 ${whatsappButtonClass}`}
              >
                <WhatsAppIcon />
                Pedir orçamento de {cat.name.toLowerCase()}
              </a>
            </div>
            }
          />
        </section>
      </div>
    </>
  );
}
