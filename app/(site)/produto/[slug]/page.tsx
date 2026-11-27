import type { Metadata } from "next";
import { WhatsAppIcon, whatsappButtonClass } from "@/components/whatsapp-icon";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageLoader } from "@/components/qualilan-loader";
import { LighteraNotice } from "@/components/lightera-notice";
import { ProductGrid } from "@/components/product-card";
import { AddToQuote } from "@/components/quote-cart";
import { getCategory, getProduct, getProducts, sortForDisplay } from "@/lib/catalog";
import { brandLogo, site, whatsappLink } from "@/lib/site";

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
  const related = sortForDisplay(
    (await getProducts()).filter((p) => p.category === product.category && p.slug !== product.slug),
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
    <div className="bg-offwhite">
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
                {product.inStock ? "Pronta entrega" : "Sob consulta"}
              </dd>
            </dl>
            {product.brand === "Lightera" && (
              <div className="mt-6">
                <LighteraNotice />
              </div>
            )}
            {product.description && (
              <details open className="group mt-6 rounded-xl border border-profundo/10 bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-semibold text-profundo [&::-webkit-details-marker]:hidden">
                  Especificações
                  <span className="icon transition-transform group-open:rotate-90">chevron_right</span>
                </summary>
                {/* Texto da ficha da loja antiga, linha a linha */}
                <p className="max-h-96 overflow-y-auto whitespace-pre-line px-4 pb-4 text-sm leading-relaxed text-marinho/80">
                  {product.description}
                </p>
              </details>
            )}

            <div className="mt-auto flex flex-col gap-3 pt-10 xl:flex-row">
              <AddToQuote product={{ slug: product.slug, name: product.name, sku: product.sku, image: product.image }} />
              <a
                href={whatsappLink(
                  `Olá, Qualilan! Gostaria de um orçamento de: ${product.name}${product.sku ? ` (cód. ${product.sku})` : ""}`,
                )}
                target="_blank"
                rel="noopener"
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
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-profundo">Mais em {cat?.name}</h2>
            <ProductGrid products={related} />
          </section>
        )}
      </div>
    </div>
  );
}
