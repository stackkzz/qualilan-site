import type { Metadata } from "next";
import { WhatsAppIcon, whatsappButtonClass } from "@/components/whatsapp-icon";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageLoader } from "@/components/qualilan-loader";
import { LighteraNotice } from "@/components/lightera-notice";
import { ProductGrid } from "@/components/product-card";
import { AddAllToQuote, AddToQuote } from "@/components/quote-cart";
import { complementsFor, getCategory, getProduct, getProducts, sortForDisplay } from "@/lib/catalog";
import { brandLogo, site, whatsappLink } from "@/lib/site";
import { parseSpecs, splitSpec } from "@/lib/specs";

// Linhas da ficha: "Chave: valor" em duas colunas; o resto como texto corrido. Sem caixa com rolagem própria.
function SpecList({ items }: { items: string[] }) {
  return (
    <dl className="mt-4 divide-y divide-profundo/10 border-y border-profundo/10 text-sm">
      {items.map((line, i) => {
        const pair = splitSpec(line);
        return (
          <div key={i} className="grid gap-1 py-3 sm:grid-cols-[220px_1fr] sm:gap-6">
            {pair ? (
              <>
                <dt className="font-medium text-profundo">{pair[0]}</dt>
                <dd className="text-marinho/80">{pair[1]}</dd>
              </>
            ) : (
              <dd className="text-marinho/80 sm:col-span-2">{line}</dd>
            )}
          </div>
        );
      })}
    </dl>
  );
}

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produto/[slug]">): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return {};
  return {
    title: `${p.name} | Qualilan`,
    description: `${p.name}${p.brand ? `, ${p.brand}` : ""}. Peça orçamento pelo WhatsApp.`,
    openGraph: p.image ? { images: [p.image] } : undefined,
  };
}

// Leitura de params dentro de Suspense: exigência da navegação instantânea (Cache Components).
export default function ProductPage({ params }: PageProps<"/produto/[slug]">) {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProductPageContent params={params} />
    </Suspense>
  );
}

async function ProductPageContent({ params }: { params: PageProps<"/produto/[slug]">["params"] }) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  const cat = getCategory(product.category);
  const logo = brandLogo(product.brand);
  const all = await getProducts();
  const together = complementsFor(product, all);
  const specs = parseSpecs(product.description ?? "");
  const related = sortForDisplay(
    all.filter((p) => p.category === product.category && p.slug !== product.slug && !together.includes(p)),
  ).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    image: product.image,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
  };

  return (
    <main className="bg-offwhite">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="mx-auto max-w-6xl px-5 py-10 lg:py-14">
        <nav aria-label="Você está em" className="mb-8 text-sm text-marinho/60">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/catalogo" className="hover:text-royal">
                Catálogo
              </Link>
            </li>
            {cat && (
              <>
                <li aria-hidden>/</li>
                <li>
                  <Link href={`/catalogo/${cat.slug}`} className="hover:text-royal">
                    {cat.name}
                  </Link>
                </li>
              </>
            )}
          </ol>
        </nav>

        <div className="grid gap-10 rounded-3xl bg-white p-6 md:grid-cols-2 md:p-10">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-offwhite">
            {product.image && (
              <Image
                src={product.image}
                alt={product.name}
                fill
                preload
                sizes="(min-width: 768px) 520px, 100vw"
                className="object-contain p-6 mix-blend-multiply"
              />
            )}
          </div>
          <div className="flex flex-col">
            {logo ? (
              <Image src={logo.logo} alt={product.brand ?? logo.name} width={Math.round((logo.w * 32) / logo.h)} height={32} className="h-8 w-auto self-start object-contain" />
            ) : (
              product.brand && <p className="font-semibold text-royal">{product.brand}</p>
            )}
            <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-profundo md:text-3xl">
              {product.name}
            </h1>
            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              {product.sku && (
                <>
                  <dt className="text-marinho/60">Código Qualilan</dt>
                  <dd className="font-medium">{product.sku}</dd>
                </>
              )}
              {product.mfrCode && (
                <>
                  <dt className="text-marinho/60">Código do fabricante</dt>
                  <dd className="font-medium">{product.mfrCode}</dd>
                </>
              )}
              {product.unit && (
                <>
                  <dt className="text-marinho/60">Vendido em</dt>
                  <dd className="font-medium">{product.unit}</dd>
                </>
              )}
              <dt className="text-marinho/60">Disponibilidade</dt>
              <dd className={`flex items-center gap-1.5 font-medium ${product.inStock ? "text-emerald-700" : "text-marinho/70"}`}>
                <span className="icon text-lg!">{product.inStock ? "check" : "inventory_2"}</span>
                {product.inStock ? "Em estoque" : "Sob consulta"}
              </dd>
            </dl>
            <div className="mt-8 flex flex-col gap-3 xl:flex-row">
              <AddToQuote product={{ slug: product.slug, name: product.name, sku: product.sku, image: product.image, unit: product.unit }} />
              <a
                href={whatsappLink(
                  `Olá, Qualilan! Gostaria de um orçamento de: ${product.name}${product.sku ? ` (cód. ${product.sku})` : ""}`,
                )}
                target="_blank"
                rel="noopener"
                data-track="item"
                data-slug={product.slug}
                className={whatsappButtonClass}
              >
                <WhatsAppIcon />
                Orçar só este item
              </a>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-marinho/60">
              <span className="icon text-lg! text-royal">schedule</span>
              Atendimento: {site.hours.toLowerCase()}
            </p>
            {product.brand === "Lightera" && (
              <div className="mt-6">
                <LighteraNotice />
              </div>
            )}

          </div>
        </div>

        {specs.length > 0 && (
          <section className="mt-10 rounded-3xl bg-white p-6 md:p-10">
            <h2 className="text-2xl font-bold tracking-tight text-profundo">Ficha técnica</h2>
            <SpecList items={specs.slice(0, 8)} />
            {specs.length > 8 && (
              <details className="group">
                <summary className="mt-4 inline-flex cursor-pointer list-none items-center gap-1 text-sm font-semibold text-royal hover:underline [&::-webkit-details-marker]:hidden">
                  <span className="group-open:hidden">Ver ficha completa ({specs.length - 8} itens a mais)</span>
                  <span className="hidden group-open:inline">Mostrar menos</span>
                  <span aria-hidden className="icon text-lg! transition-transform group-open:rotate-90">
                    chevron_right
                  </span>
                </summary>
                <SpecList items={specs.slice(8)} />
              </details>
            )}
          </section>
        )}

        {together.length > 0 && (
          <section className="mt-16 rounded-3xl bg-white p-6 md:p-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-profundo">Compre junto</h2>
                <p className="mt-1 text-marinho/60">Itens que costumam entrar no mesmo projeto.</p>
              </div>
              <AddAllToQuote
                products={[product, ...together].map((p) => ({ slug: p.slug, name: p.name, sku: p.sku, image: p.image }))}
              />
            </div>
            <ProductGrid products={together} />
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-profundo">Mais em {cat?.name}</h2>
            <ProductGrid products={related} />
          </section>
        )}
      </div>
    </main>
  );
}
